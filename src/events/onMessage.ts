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
            // allow 1 gm every 24 hours
            if (new Date().getTime() - lastGm < 24 * 60 * 60 * 1000) {
                message.reply({ content: "You can say gm once every 24 hours" }).then(msg => {
                    setTimeout(() => {
                        if (msg.deletable) {
                            msg.delete();
                        } else {
                            console.log("Message is not deletable");
                        }
                    }, 5000);
                });
                return;
            }
            const deleteTime = new Date(new Date().getTime() + 6000).getTime();
            const messageContent = `gm <@${message.author.id}>

Your last gm was <t:${Math.floor(lastGm / 1000)}:R>
You have said gm \`${gms.total + 1}\` times [Week: \`${gms.gmsThisWeek + 1}\` | Month: \`${gms.gmsThisMonth + 1}\` | Year: \`${gms.gmsThisYear + 1}\`]
Total gms: \`${gms.total}\`

_This message will self-destruct in <t:${Math.floor(deleteTime / 1000)}:R>_ 🧃`;
            incrementGmCount(message.author.id, message.channel.id);
            message.reply({ content: messageContent }).then(msg => {
                setTimeout(() => {
                    if (msg.deletable) {
                        msg.delete();
                    } else {
                        console.log("Message is not deletable");
                    }
                }, 5000);
            });
        }
    }
};