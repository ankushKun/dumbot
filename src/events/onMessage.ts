import { ChannelType, Events, Message, MessageFlags } from 'discord.js';
import { getGmCount } from '../utils/state.js';
import { incrementGmCount } from '../utils/state.js';

export const name = Events.MessageCreate;
export const once = false;
export const execute = async (message: Message) => {
    if (message.author.bot) return;
    if (message.channel.type === ChannelType.GuildText) {
        if (message.channel.name.includes("gm") && message.content.toLowerCase().includes('gm')) {
            const gms = getGmCount(message.author.id, message.channel.id);
            const lastGm = new Date(gms.lastGm).getTime();
            const currentTime = new Date().getTime();
            const daysSinceLastGm = Math.floor((currentTime - lastGm) / (24 * 60 * 60 * 1000));
            const streakUpdated = gms.updatedToday;

            const streak = streakUpdated ? gms.streak :
                daysSinceLastGm > 1 ? 1 :
                    gms.streak + 1;
            let messageContent = `gm <@${message.author.id}>

Your last gm was <t:${Math.floor(lastGm / 1000)}:R>
Current streak: \`${gms.streak}\` days 🔥`

            if (streakUpdated) {
                messageContent += `\n_You have already said gm today_`
            }



            incrementGmCount(message.author.id, message.channel.id, streak);
            const reply = await message.reply(messageContent);
            setTimeout(() => reply.delete(), 5000);
        }
    }
};
// You have said gm \`${gms.total + 1}\` times [Week: \`${gms.gmsThisWeek + 1}\` | Month: \`${gms.gmsThisMonth + 1}\` | Year: \`${gms.gmsThisYear + 1}\`]`;