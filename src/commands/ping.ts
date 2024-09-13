import { $applicationCommand } from "../handlers.js";

$applicationCommand({
    name: "ping",
    description: "pong",
    handle: async (interaction) => {
        const { ws, rest } = await interaction.client.ping();
        await interaction.reply({
            content: `🏓 WebSocket: \`${ws}ms\` | Rest: \`${rest}ms\``
        });
    }
});
