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
    const content = `I am in ${guildCount} servers!

API Latency: ${latency}ms 
Uptime: ${formatTime(uptime)} 

`;

    const embed = new EmbedBuilder()
        .setTitle('Hi I am gmAO :3')
        .setDescription(content)
        .setColor(0x3bd870)
        .setFooter({ text: 'built with ❤️ by ArweaveIndia', iconURL: interaction.client.user?.displayAvatarURL() || '' });

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Add me to your server')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://discord.com/oauth2/authorize?client_id=${interaction.client.user?.id}&permissions=2147608640&integration_type=0&scope=bot`)
        );

    await interaction.reply({ embeds: [embed], components: [row] });
};