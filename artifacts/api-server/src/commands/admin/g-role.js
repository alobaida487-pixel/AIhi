module.exports = {
    name: 'g-role',
    async execute(message, args, client) {
        if (!message.member.permissions.has('ManageRoles')) {
            return message.reply(` | **You Don't Have __Perm In Role__**`);
        }

        const theUser = message.mentions.members.first();
        const theRole = message.mentions.roles.first();

        if (!theUser) return message.reply('** | Please __Mention__ A User !**');
        if (!theRole) return message.reply('** | Please __Mention__ A Role !**');

        theUser.roles.add(theRole)
            .then(() => {
                message.reply("> **Done** : __Adding The Role__ ");
            })
            .catch((error) => {
                message.reply("Error : " + error.message);
            });
    }
};
