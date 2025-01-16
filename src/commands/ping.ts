import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!');

export const execute = async (interaction: ChatInputCommandInteraction) => {
    const sent = await interaction.reply({ content: 'Pinging...', withResponse: true });
    const latency = sent.interaction.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`Pong! 🏓\nLatency: ${latency}ms`);
};