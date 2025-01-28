import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { top10gmStreak } from '../utils/state.js';

export const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Leaderboard of gm count!');

export const execute = async (interaction: ChatInputCommandInteraction) => {
    const leaderboard = top10gmStreak();
    const leaderboardString = leaderboard.map(([userId, gmCount], index) => `${index + 1}. <@${userId}> \`${gmCount.streak}\` days ${index == 0 ? '🥇' : index == 1 ? '🥈' : index == 2 ? '🥉' : ''}`).join('\n');
    const embed = new EmbedBuilder()
        .setTitle('GM Streak Leaderboard')
        .setDescription(leaderboardString);
    await interaction.reply({ embeds: [embed] });
};