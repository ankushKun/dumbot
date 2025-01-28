import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getGmCount } from '../utils/state.js';

export const data = new SlashCommandBuilder()
    .setName('gms')
    .setDescription('Your gm count!')
    .addUserOption(option => option.setName('user').setDescription('The user to get the gm count for').setRequired(false));

export const execute = async (interaction: ChatInputCommandInteraction) => {
    const user = interaction.options.getUser('user') || interaction.user;
    const otherUser = interaction.options.getUser('user') as any as boolean;

    const gms = getGmCount(user.id, interaction.channelId);
    await interaction.reply(`${otherUser ? `${user.displayName} has` : 'You have'} said gm \`${gms.total}\` times

gms this week: \`${gms.gmsThisWeek}\`
gms this month: \`${gms.gmsThisMonth}\`
gms this year: \`${gms.gmsThisYear}\`

${otherUser ? `${user.displayName}'s last gm was` : 'Your last gm was'} <t:${Math.floor(new Date(gms.lastGm).getTime() / 1000)}:R>
${otherUser ? `${user.displayName}'s current streak is` : 'Your current streak is'} \`${gms.streak}\` days 🔥

${gms.updatedToday ? `_${otherUser ? `${user.displayName} has` : 'You have'} already said gm today_` : ''}`);
};