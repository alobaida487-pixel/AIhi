const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'come',
    async execute(message, args, client) {
        const user = message.mentions.members.first();

        if (!user) return message.reply(`** | I Can't Find This User!**`);
        if (user.id === message.author.id) return message.reply(`** | You Can't __Send To__ Yourself!**`);
        if (user.user.bot) return message.reply(`** | You Can't __Send To__ Bot!**`);

        const link = client.config.link;

        try {
            const msg = (" > 𝖲𝗈𝗋𝗋𝗒 𝖥𝗈𝗋 𝖣𝗂𝗌𝗍𝗎𝗋𝖻𝖺𝗇𝖼𝖾 __𝖸𝗈𝗎 𝖧𝖺𝗏𝖾 𝖱𝖾𝗊𝗎𝖾𝗌𝗍𝖾𝖽__ \n\n#- 𝐓𝐡𝐞 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 : {channel} \n\n#- 𝐘𝐨𝐮 𝐑𝐞𝐪𝐮𝐞𝐬𝐭 𝐁𝐲 : {author} \n\n> __𝐒𝐞𝐫𝐯𝐞𝐫 𝐋𝐢𝐧𝐤__ : [ {link} ] ❤️ ").replaceAll('{channel}', `${message.channel}`).replaceAll('{author}', `${message.member.displayName || message.author.tag}`).replaceAll('{link}', `${link}`);
            await user.send(msg);

            const tempMsg = await message.reply({
                embeds: [new EmbedBuilder().setDescription(`** | Please Wait ....**`).setImage(client.config.line).setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() }).setColor(client.config.color)]
            });

            setTimeout(() => {
                tempMsg.edit({
                    embeds: [new EmbedBuilder().setDescription(`** | Done Message __Has Been Send__ To ${user}**\n\n** | __Please__ Wait**`).setImage(client.config.line).setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() }).setColor(client.config.color)]
                });
            }, 1800);
        } catch (error) {
            const tempMsg = await message.reply({
                embeds: [new EmbedBuilder().setDescription(`> ** | Please Wait ....**`).setImage(client.config.line).setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() }).setColor(client.config.color)]
            });
            setTimeout(() => {
                tempMsg.edit({
                    embeds: [new EmbedBuilder().setDescription(`** | Error __${error.message}__**`).setImage(client.config.line).setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() }).setColor(client.config.color)]
                });
            }, 1800);
        }
    }
};
