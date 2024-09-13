import { ApplicationCommandOptionType } from "lilybird";
import { spotifyClient } from "src/index.js";
import { $applicationCommand } from "../handlers.js";
import { file } from "bun";

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
    handle: async (interaction) => {
        const track = await spotifyClient.getTrackById(interaction.data.getString("query", true));

        if (!track)
            return;

        const res = await fetch(track.preview_url);

        const artistsMap = track.artists.map((artist) => artist.name).join(" & ");

        await interaction.reply({
            embeds: [
                {
                    title: `${artistsMap} - ${track.name}`,
                    image: { url: track.album.images[0].url },
                    fields: [
                        {
                            name: "Listen on",
                            value: `[Spotify](${track.external_urls.spotify})`
                        }
                    ]
                }
            ],
            files: [ { name: `${artistsMap} - ${track.name} (preview).mp3`, file: await res.blob() } ]
        });
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

