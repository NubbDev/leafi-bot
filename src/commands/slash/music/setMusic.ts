import { ApplicationCommand, ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";
import { CommandType } from '../../../types';

export default {
    name: 'musicset',
    description: 'Set the music channel',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'channel',
            description: 'The channel to set as the music channel',
            type: 7,
            required: true
        }
    ],
    async run(client, interaction: ChatInputCommandInteraction) {
        const {guild} = interaction

        if (!guild) return

        const channel = interaction.options.getChannel('channel', true)

        try {
            client.musicChannel.set(guild.id, channel.id)

            interaction.reply(`Music channel set to ${channel}!`)

        } catch (error) {
            client.logger.error(error)
            interaction.reply('Something went wrong!')
        }
    },
} as CommandType