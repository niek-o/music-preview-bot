import { ApplicationCommandOptionType, ButtonStyle, ComponentType } from "lilybird";
import { spotifyClient } from "src/index.js";
import { $applicationCommand } from "../handlers.js";
import { file } from "bun";
import { createVideo, deleteFiles } from "src/utils/music-stuff/ffmpeg-child-process.js";
import { google } from "googleapis";

$applicationCommand({
    name: "search",
    description: "Search for a song on spotify",
    options: [
        {
            name: "query",
            description: "The search query",
            type: ApplicationCommandOptionType.STRING,
            required: true,
            autocomplete: true
        }
    ],
    integration_types: [0, 1],
    handle: async (interaction) => {
        await interaction.deferReply();

        const track = await spotifyClient.getTrackById(interaction.data.getString("query", true));

        if (!track)
            return;

        const res = await fetch(track.preview_url);

        const buffer = await res.arrayBuffer();

        await Bun.write(`temp/${track.id}.mp3`, buffer);

        const image = await fetch(track.album.images[0].url);

        const imageBuffer = await image.arrayBuffer();

        await Bun.write(`temp/${track.id}.png`, imageBuffer);

        await createVideo(track.id);

        const artistsMap = track.artists.map((artist) => artist.name).join(" & ");

        const videoFile = Bun.file(`temp/${track.id}.mp4`);

        const youtube = google.youtube("v3");

        const youtubeSearch = await youtube.search.list({
            key: process.env.GOOGLE_API_KEY,
            part: ["snippet"],
            q: `${artistsMap} - ${track.name}`,
            maxResults: 1,
            type: ["video"]
        });

        if (!youtubeSearch.data.items) return;

        await interaction.editReply({
            content: `**${artistsMap} - ${track.name} (preview)**`,
            files: [ { name: `${artistsMap} - ${track.name} (preview).mp4`, file: videoFile } ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            url: track.external_urls.spotify,
                            label: "Spotify",
                            style: ButtonStyle.Link,
                            emoji: { id: "1285196306100387952", name: "spotify" }
                        }
                    ]
                },
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            url: `https://www.youtube.com/watch?v=${youtubeSearch.data.items[0].id?.videoId}`,
                            label: "Youtube",
                            style: ButtonStyle.Link,
                            emoji: { id: "1285196316397408297", name: "youtube" }
                        },
                        {
                            type: ComponentType.Button,
                            url: `https://music.youtube.com/watch?v=${youtubeSearch.data.items[0].id?.videoId}`,
                            label: "Youtube Music",
                            style: ButtonStyle.Link,
                            emoji: { id: "1285196323913728011", name: "youtubemusic" }
                        }
                    ]
                }
            ]
        });

        await deleteFiles(track.id);
    },
    autocomplete: async (interaction) => {
        const query = interaction.data.getFocused<string>().value;

        if (query === "") return;

        const searchResult = await spotifyClient.search(query);

        if (!searchResult)
            return;

        const choicesMap = searchResult.tracks.items.map((track) => {
            const artistsMap = track.artists.map((artist) => artist.name).join(" & ");

            return { name: `${artistsMap} - ${track.name}`, value: track.id };
        });

        await interaction.showChoices(choicesMap);
    }
});

