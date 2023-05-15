import { Events } from "discord.js";
import { EventType } from "../types";

export default {
    name: "Ready",
    run(client) {
        client.bot.on(Events.ClientReady, () => {
            client.musicChannel.set('949338224562692126', '949338224562692130')
        })
    },
} as EventType