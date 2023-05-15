
import { GuildQueueEvent } from "discord-player";
import { EventType } from "../types";
import { TextChannel } from "discord.js";

export default {
    name: "Music Events",
    async run(client) {
        client.player.events.on(GuildQueueEvent.playerStart, 
            async (queue, track) => {
                const channelid = client.musicChannel.get((queue.metadata as any)!.guild.id) as string

                let channel = client.bot.channels.cache.get(channelid) as TextChannel

                if (!channel) channel = (queue.metadata as any)!.channel

                if (!channel) return
                await channel.send(`Now playing **${track.title}**`)

                queue?.filters.equalizer?.setEQ([
                    { band: 0, gain: 0.25 },
                    { band: 1, gain: 0.25 },
                    { band: 2, gain: 0.25 }
                ]);
        })
        client.player.events.on(GuildQueueEvent.playerPause, 
            async (queue) => {
                const channelid = client.musicChannel.get((queue.metadata as any)!.guild.id) as string

                let channel = client.bot.channels.cache.get(channelid) as TextChannel

                if (!channel) channel = (queue.metadata as any)!.channel
                
                if (!channel) return
                await channel.send(`**Music Paused**`)
        })
        client.player.events.on(GuildQueueEvent.playerResume, 
            async (queue) => {
                const channelid = client.musicChannel.get((queue.metadata as any)!.guild.id) as string

                let channel = client.bot.channels.cache.get(channelid) as TextChannel

                if (!channel) channel = (queue.metadata as any)!.channel
                
                if (!channel) return
                await channel.send(`**Continuing Music**`)
        })
        client.player.events.on(GuildQueueEvent.playerSkip, 
            async (queue, track) => {
                const channelid = client.musicChannel.get((queue.metadata as any)!.guild.id) as string

                let channel = client.bot.channels.cache.get(channelid) as TextChannel

                if (!channel) channel = (queue.metadata as any)!.channel
                
                if (!channel) return

                await channel.send(`Skipping track to **${track.title}**`)
        })
        client.player.events.on(GuildQueueEvent.playerFinish, 
            async (queue, track) => {
                const channelid = client.musicChannel.get((queue.metadata as any)!.guild.id) as string

                let channel = client.bot.channels.cache.get(channelid) as TextChannel

                if (!channel) channel = (queue.metadata as any)!.channel
                
                if (!channel) return

                await channel.send(`Song **${track.title}**, ended`)
        })
    },
} as EventType