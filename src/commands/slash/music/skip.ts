import { ApplicationCommand, ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";
import { CommandType } from '../../../types';
import { useQueue } from "discord-player";

export default {
    name: 'skip',
    description: 'Skip the song',
    type: ApplicationCommandType.ChatInput,
    async run(client, interaction: ChatInputCommandInteraction) {
        const {guild} = interaction

        if (!guild) return

        const member = guild.members.cache.get(interaction.user.id)

        const channel = member?.voice.channel

        if (!channel) {
            interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true })
            return
        }
        

        try {
            const queue = useQueue(guild.id)

            if (!queue) return interaction.reply({ content: 'No queue found!', ephemeral: true })

            queue.node.skip()

            interaction.reply(
                {
                    content: `Skipped the song!`,
                    ephemeral: true
                }
            )

        } catch (error) {
            client.logger.error(error)
            interaction.followUp('Something went wrong!')
        }
    },
} as CommandType