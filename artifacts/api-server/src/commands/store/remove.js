const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'remove',
    async execute(message, args, client) {
        const ownerIds = client.config.users.owner;
        if (!ownerIds.includes(message.author.id)) {
            return message.reply(`** | This Command Only __Hight Rank__**`);
        }
        if (!message.member.permissions.has('ManageRoles')) {
            return message.reply(`** | You Don't Have __Perm__ In Role**`);
        }

        const user = message.mentions.members.first();
        const reason = args.slice(1).join(" ") || "No reason provided";

        if (!user) return message.reply("** | Pls __Mention__ Seller**");

        const upgradeRoomId = client.config.channels.upgraderoom;
        const upgradeChannel = client.channels.cache.get(upgradeRoomId);

        if (upgradeChannel) {
            await upgradeChannel.send(` || @everyone ||\n\n${user} 𝖧𝖺𝗌 𝖡𝖾𝖾𝗇 __𝖱𝖾𝗆𝗈𝗏𝖾𝖽__ 𝖥𝗋𝗈𝗆 𝖳𝗁𝖾 :\n<@&${client.config.roles.team}> ❌\n\n __𝖳𝗁𝖾 𝖱𝖾𝖺𝗌𝗈𝗇__ : ${reason} 🚫\n`);
            await upgradeChannel.send({ embeds: [new EmbedBuilder().setColor(client.config.color)] });
        }

        const upgradedmembed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTimestamp()
            .setDescription(`** \n ${user} , 𝖸𝗈𝗎 𝖧𝖺𝗏𝖾 __𝖱𝖾𝗆𝗈𝗏𝖾𝖽__ 𝖥𝗋𝗈𝗆 𝖳𝗁𝖾 Dexero Team ❌\n\n __𝖱𝖾𝗆𝗈𝗏𝖾𝖽 𝖡𝗒__ : ${message.author}\n**`)
            .setFooter({ text: `> 𝖱𝖾𝗆𝗈𝗏𝖾𝖽 𝖥𝗈𝗋 ${message.author.tag}` });

        await user.send({ embeds: [upgradedmembed] }).catch(() => {});
        message.reply("> **𝖣𝗈𝗇𝖾** : __Removed The Seller__  ");
    }
};
