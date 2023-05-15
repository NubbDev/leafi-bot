import { ActivityType, Client, Events, IntentsBitField, PresenceUpdateStatus } from "discord.js";
import { ClientType } from "./types";
import dotenv from "dotenv";
import pino from 'pino'
import path from 'path'
import {Player} from 'discord-player'

dotenv.config();

const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildScheduledEvents,
        IntentsBitField.Flags.GuildMessageTyping,
        IntentsBitField.Flags.GuildEmojisAndStickers,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.MessageContent
    ],
});

const player = new Player(bot, {ytdlOptions: {
    filter: 'audioonly',
    highWaterMark: 1 << 25,
    quality: 'highestaudio',
}
})

const transport = pino.transport({
    target: 'pino/file',
    options: {
        destination: path.join(__dirname, './log.json')
    }
})

const client: ClientType = {
    bot: bot,
    logger: pino(transport), 
    slashcommands: new Map(),
    commands: new Map(),
    events: new Map(),
    config: {
        owners: [process.env.NUBBID as string],
        prefix: "!",
        devGuild: ""
    },
    paths: {
        slashcommands: new Map(),
        commands: new Map(),
    },
    player: player,
    musicChannel: new Map()
};

["commands", "events"].forEach(async files => {
    await Promise.allSettled([
        new Promise(async resolve => {
            const x = await import(`./handlers/${files}`)
            await x.default(client)
            resolve(true)
        })
    ]);
});



client.bot.login(process.env.TOKEN).then(() => {
    client.bot.user?.setPresence({
        activities: [
            {
                name: "with your mom 😏",
                type: ActivityType.Playing
            }
        ],
        status: PresenceUpdateStatus.Idle
    })
    client.logger.info(`Logged in as @${client.bot.user?.tag}`)
    console.log(`Logged in as @${client.bot.user?.tag}`)

});
export default client;