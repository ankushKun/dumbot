import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { top10gmStreak } from '../utils/state.js';

export const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Leaderboard of gm streaks!');

export const execute = async (interaction: ChatInputCommandInteraction) => {
    const leaderboard = top10gmStreak();

    if (leaderboard.length === 0) {
        await interaction.reply('No one has said gm yet!');
        return;
    }

    const embed = new EmbedBuilder()
        .setTitle('GM Streak Leaderboard')
        .setColor('#FFD700');

    // Add top 3 users as highlighted entries
    let topStreaksContent = '';
    for (let i = 0; i < Math.min(3, leaderboard.length); i++) {
        const [userId, gmCount] = leaderboard[i];
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
        const lastGmTimestamp = Math.floor(new Date(gmCount.lastGm).getTime() / 1000);
        topStreaksContent += `${medal} <@${userId}> - \`${gmCount.streak}\` days (last: <t:${lastGmTimestamp}:R>)\n`;
    }

    if (topStreaksContent) {
        embed.addFields({ name: 'Top Streaks', value: topStreaksContent, inline: false });
    }

    // Add remaining users as normal entries
    if (leaderboard.length > 3) {
        let otherUsersContent = '';
        for (let i = 3; i < leaderboard.length; i++) {
            const [userId, gmCount] = leaderboard[i];
            const lastGmTimestamp = Math.floor(new Date(gmCount.lastGm).getTime() / 1000);
            otherUsersContent += `${i + 1}. <@${userId}> - \`${gmCount.streak}\` days (last: <t:${lastGmTimestamp}:R>)\n`;
        }

        if (otherUsersContent) {
            embed.addFields({ name: 'Other Participants', value: otherUsersContent, inline: false });
        }
    }

    // Add footer with timestamp
    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    embed.setFooter({
        text: `Say gm every day to increase your streak! • Today at ${currentTime}`
    });

    await interaction.reply({ embeds: [embed] });
};