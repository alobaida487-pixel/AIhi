const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'upgrade',
    async execute(message, args, client) {
        const ownerIds = client.config.users.owner;
        if (!ownerIds.includes(message.author.id)) {
            return message.reply(`** | This Command Only __Hight Rank__**`);
        }
        if (!message.member.permissions.has('ManageRoles')) {
            return message.reply(`** | You Don't Have __Perm__ In Role**`);
        }

        const user = message.mentions.members.first();
        const roleArg = message.mentions.roles.first();

        if (!user) return message.reply("** | Pls __Mention__ Seller**");
        if (!roleArg) return message.reply("** | Pls __Mention__ Roles seller**");

        await user.roles.add(roleArg);

        const upgradeRoomId = client.config.channels.upgraderoom;
        const upgradeChannel = client.channels.cache.get(upgradeRoomId);

        if (upgradeChannel) {
            const msg = (" || @everyone ||\n                         __𝐔𝐩𝐝𝐫𝐚𝐝𝐞 𝐓𝐞𝐚𝐦 𝐎𝐟 Thailand Codes & dexero__ \n\n **𝖲𝖾𝗅𝗅𝖾𝗋 : {user}** \n **𝖴𝗉𝗀𝐫𝐚𝐝𝐞𝐝 𝖳𝗈 : {role}**  \n **𝖪𝖾𝖾𝗉 𝖦𝗈𝗂𝗇𝗍 𝖠𝗇𝖽 𝖳𝗁𝖺𝗇𝗄 𝖸𝗈𝗎 𝖥𝗈𝗋 𝖠𝖼𝗍𝗂𝗏𝖺𝗂𝗍𝗂𝗇𝗀 𝖨𝗇 __Dexero-𝖲__** 🎉\n\n __𝖢ᅩ𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧__ ").replaceAll('{user}', `${user}`).replaceAll('{role}', `${roleArg}`);
            await upgradeChannel.send(msg);
            await upgradeChannel.send({ embeds: [new EmbedBuilder().setImage(client.config.line).setColor(client.config.color)] });
        }

        const upgradedmembed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTimestamp()
            .setDescription(`** \n> 𝖧𝖾𝗅𝗅𝗈 ${user} , 𝖸𝗈𝗎 𝖧𝖺𝗏𝖾 𝖡𝖾𝖾𝗇 𝖯𝗋𝗈𝗆𝗈𝗍𝖾𝖽 𝖳𝗈 𝖭𝖾𝗑𝗍 𝖱𝗈𝗅𝖾 \n\n  __𝖳𝗁𝖾 𝖠𝖽𝗆𝗂𝗇__ : ${message.author} \n\n  𝖳𝗁𝗑 𝖥𝗈𝗋 𝖠𝖼𝗍𝗂𝗏𝖺𝗍𝗂𝗇𝗀 𝖨𝗇 __Thailand Codes & dexero__   \n\n __𝖪𝖾𝖾𝗉 𝖦𝗈𝗂𝗇𝗀__ \n**`)
            .setFooter({ text: `𝖴𝗉𝗀𝗋𝖺𝖽𝖾 𝖥𝗈𝗋 ${message.author.tag}` });

        await user.send({ embeds: [upgradedmembed] }).catch(() => {});
        message.reply("> **𝖣𝗈𝗇𝖾** : __Promoted The Seller__  ");
    }
};
