import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

function formatTime(ms: number) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}

export const data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('About gmAO!');

export const execute = async (interaction: ChatInputCommandInteraction) => {
    const guildCount = interaction.client.guilds.cache.size;
    const uptime = interaction.client.uptime;
    const latency = interaction.client.ws.ping;

    // Create a simple, clean description
    let description = `**GMAO** is a bot that tracks your daily GM streaks.\n\n`;

    // Add essential stats
    description += `**Stats:**\n`;
    description += `• Servers: ${guildCount}\n`;
    description += `• Uptime: ${formatTime(uptime)}\n`;
    description += `• Latency: ${latency}ms\n\n`;

    // Add command list
    description += `**Commands:**\n`;
    description += `• \`/gms\` - Check your GM stats\n`;
    description += `• \`/leaderboard\` - See top GM streaks\n`;
    description += `• \`/info\` - Show this information\n`;
    description += `• \`/ping\` - Check bot ping\n\n`;

    // Simple usage instructions
    description += `**How to Use:**\n`;
    description += `Say "gm" in any channel with "gm" in its name to track your daily GM streak. The bot will count your streaks and show stats.`;

    const embed = new EmbedBuilder()
        .setTitle('GMAO - GM Tracker')
        .setColor('#FFD700')
        .setDescription(description)
        .setFooter({
            text: 'Built by ArweaveIndia',
            iconURL: interaction.client.user?.displayAvatarURL() || ''
        });

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Add to Server')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://discord.com/oauth2/authorize?client_id=${interaction.client.user?.id}&permissions=2147608640&integration_type=0&scope=bot`),
            new ButtonBuilder()
                .setLabel('Arweave')
                .setStyle(ButtonStyle.Link)
                .setURL('https://arweave.org'),
            new ButtonBuilder()
                .setLabel('GitHub')
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/ankushKun/dumbot')
        );

    await interaction.reply({ embeds: [embed], components: [row] });
};