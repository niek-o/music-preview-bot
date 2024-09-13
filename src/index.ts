import { defaultTransformers } from "@lilybird/transformers";
import { createClient, Intents } from "lilybird";
import { handler } from "./handlers.js";
import { SpotifyClient } from "./utils/spotify/spotify-client.js";

handler.cachePath = `${import.meta.dir}/lily-cache/handler`;
await handler.scanDir(`${import.meta.dir}/commands`);

const { interactionCreate, ...trimmed } = defaultTransformers;

export const spotifyClient = new SpotifyClient(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET);

await createClient({
    token: process.env.TOKEN,
    intents: [Intents.GUILDS],
    transformers: trimmed,
    setup: async (client) => {
        console.log(`Logged in as ${client.user.username}`);

        await handler.loadGlobalCommands(client);
    },
    listeners: handler.getListenersObject()
});
