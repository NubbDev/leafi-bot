import { ApplicationCommand, ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";
import { CommandType } from '../../../types';
import { useQueue } from "discord-player";

export default {
    name: 'volume',
    description: 'Set bot Volume',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'percent',
            description: 'The volume percent',
            type: 4,
        }
    ],
    async run(client, interaction: ChatInputCommandInteraction) {
        const {guild} = interaction

        if (!guild) return

        const member = guild.members.cache.get(interaction.user.id)

        const channel = member?.voice.channel
        
        if (!channel) {
            interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true })
            return
        }
        const queue = useQueue(guild.id)
        
        if (!queue) return interaction.reply({ content: 'No queue found!', ephemeral: true })
        const percent = interaction.options.getInteger('percent', true)
        if (!percent) {
            return interaction.reply(
                {
                    content: `Bot volume is ${queue.node.volume}%`,
                }
            )
        }

        try {

            queue.node.setVolume(percent)

            interaction.reply(
                {
                    content: `Set bot volume to ${queue.node.volume}%`,
                }
            )

        } catch (error) {
            client.logger.error(error)
            interaction.followUp('Something went wrong!')
        }
    },
} as CommandType