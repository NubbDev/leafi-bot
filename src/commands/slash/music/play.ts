import { ApplicationCommand, ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";
import { CommandType } from '../../../types';
import { Player, QueryType, useMasterPlayer, useQueue } from "discord-player";

export default {
    name: 'play',
    description: 'Play a song',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'song',
            description: 'The song to play',
            type: 3,
            required: true
        }
    ],
    async run(client, interaction: ChatInputCommandInteraction) {

        const player = useMasterPlayer() as Player
        const {guild} = interaction

        if (!guild) return

        const member = guild.members.cache.get(interaction.user.id)

        const channel = member?.voice.channel

        if (!channel) {
            interaction.reply('You must be in a voice channel to use this command!')
            return
        }

        const song = interaction.options.getString('song', true)
        
        await interaction.deferReply()

        try {
            let queue = useQueue(guild.id)
            
            if (!queue) {
                const {track} = await client.player.play(channel, song, {
                    nodeOptions : {
                        metadata: interaction,
                    },
                })
                
                await interaction.followUp({
                    content: `Now playing ${track.title}!`,
                    ephemeral: true
                })

            } else if (queue && !queue.node.isPlaying()) {

                const {track} = await client.player.play(channel, song, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO,
                    nodeOptions : {
                        metadata: interaction,
                    }
                })

                interaction.followUp({
                    content: `Now playing ${track.title}!`,
                    ephemeral: true
                })
            
            } else {
                const {tracks} = await client.player.search(song, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })

                if (!tracks.length) return interaction.followUp('No tracks found!')

                queue.addTrack(tracks[0])

                interaction.followUp(`Added **${tracks[0].title}** to the queue!`)
            }

        } catch (error) {
            client.logger.error(error)
            interaction.followUp('Something went wrong!')
        }
    },
} as CommandType