module.exports = {
    name: 'unban',
    async execute(message, args, client) {
        if (!message.member.permissions.has('BanMembers')) {
            return message.reply(`** 😕 You don't have __permissions__ **`);
        }
        if (!message.guild.members.me.permissions.has('BanMembers')) return;

        let id = args[0];
        if (!id || isNaN(id)) {
            return message.reply(`** 😕 Please __provide__ member id **`);
        }

        message.guild.members.unban(id).then(user => {
            message.reply(`** ${user.tag} unbanned!**`);
        }).catch(err => {
            message.reply(`**I can't find __this member__ in bans list**`);
        });
    }
};
