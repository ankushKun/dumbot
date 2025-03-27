import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getGmCount } from '../utils/state.js';

export const data = new SlashCommandBuilder()
    .setName('gms')
    .setDescription('Your gm count!')
    .addUserOption(option => option.setName('user').setDescription('The user to get the gm count for').setRequired(false));

export const execute = async (interaction: ChatInputCommandInteraction) => {
    const user = interaction.options.getUser('user') || interaction.user;
    const isOtherUser = interaction.options.getUser('user') !== null;

    const gms = getGmCount(user.id, interaction.channelId);
    const lastGmTimestamp = Math.floor(new Date(gms.lastGm).getTime() / 1000);

    const embed = new EmbedBuilder()
        .setTitle(`${isOtherUser ? `${user.displayName}'s` : 'Your'} GM Statistics`)
        .setColor('#FFD700')
        .addFields(
            { name: 'Total GMs', value: `\`${gms.total}\` times`, inline: true },
            { name: 'Current Streak', value: `\`${gms.streak}\` days 🔥`, inline: true },
            { name: 'Last GM', value: `<t:${lastGmTimestamp}:R>`, inline: true },
            { name: 'Weekly GMs', value: `\`${gms.gmsThisWeek}\` times`, inline: true },
            { name: 'Monthly GMs', value: `\`${gms.gmsThisMonth}\` times`, inline: true },
            { name: 'Yearly GMs', value: `\`${gms.gmsThisYear}\` times`, inline: true }
        )
        .setFooter({ text: gms.updatedToday ? `${isOtherUser ? `${user.displayName} has` : 'You have'} already said gm today` : 'Say gm every day to increase your streak!' })
        .setTimestamp();

    if (user.displayAvatarURL()) {
        embed.setThumbnail(user.displayAvatarURL());
    }

    await interaction.reply({ embeds: [embed] });
};