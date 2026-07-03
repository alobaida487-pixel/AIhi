const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ban',
    async execute(message, args, client) {
        if (!message.member.permissions.has('BanMembers')) {
            return message.reply(`** 😕 You don't have __permissions__ **`);
        }
        if (!message.guild.members.me.permissions.has('BanMembers')) return;

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.reply(`** 😕 Please __mention__ member or id **`);
        }

        if (user.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId) {
            return message.reply(`**  | You can't ban __this user__**`);
        }

        if (!user.bannable) {
            return message.reply(`**  | I can't ban __this user__**`);
        }

        await user.ban().catch(err => console.log(err));
        await message.reply(`**${user.user.tag} banned __from__ the server!**✈️`);
    }
};
