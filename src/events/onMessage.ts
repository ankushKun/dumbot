import { ChannelType, EmbedBuilder, Events, Message, MessageFlags } from 'discord.js';
import { getGmCount } from '../utils/state.js';
import { incrementGmCount } from '../utils/state.js';

export const name = Events.MessageCreate;
export const once = false;
export const execute = async (message: Message) => {
    if (message.author.bot) return;
    if (message.channel.type === ChannelType.GuildText) {
        if (message.channel.name.includes("gm") && message.content.toLowerCase().includes('gm')) {
            const gms = getGmCount(message.author.id, message.channel.id);
            console.log(gms);

            const lastGm = new Date(gms.lastGm).getTime();
            const currentTime = new Date().getTime();
            const daysSinceLastGm = Math.floor((currentTime - lastGm) / (24 * 60 * 60 * 1000));

            let streak = gms.streak;

            // If already said gm today, keep the current streak
            if (gms.updatedToday) {
                // Streak stays the same
            }
            // If user said gm yesterday, increment streak
            else if (daysSinceLastGm <= 1) {
                streak = gms.streak + 1;
            }
            // If user missed a day or more, reset streak to 1
            else {
                streak = 1;
            }

            // Create a clean, minimal embed
            const embed = new EmbedBuilder()
                .setColor(gms.updatedToday ? '#FFA500' : '#00FF00')
                .setDescription(`**Good Morning, ${message.author.displayName}!**`);

            // Add stats section with clean formatting
            let statsText = '';

            // Format streak with optional fire emoji only for impressive streaks
            const streakText = streak >= 30 ? `${streak} days 🔥` : `${streak} days`;
            statsText += `**Streak:** ${streakText}\n`;

            // Add total count
            statsText += `**Total GMs:** ${gms.updatedToday ? gms.total : gms.total + 1}\n`;

            // Add last GM time
            statsText += `**Last GM:** <t:${Math.floor(lastGm / 1000)}:R>`;

            // Add weekly progress in simple format if streak is substantial
            if (streak >= 3 && gms.gmsThisWeek > 0) {
                statsText += `\n**This Week:** ${gms.gmsThisWeek}/7 days`;
            }

            embed.addFields({ name: 'Stats', value: statsText });

            // Simple footer based on status
            if (gms.updatedToday) {
                embed.setFooter({ text: 'You have already said gm today' });
            }

            incrementGmCount(message.author.id, message.channel.id, streak);
            const reply = await message.reply({ embeds: [embed] });
            setTimeout(() => reply.delete(), 8000);
        }
    }
};
// You have said gm \`