module.exports = {
    name: 'r-role',
    async execute(message, args, client) {
        if (!message.member.permissions.has('ManageRoles')) {
            return message.reply(` | **You Don't have __Perm In Role__**`);
        }

        const theUser = message.mentions.members.first();
        const theRole = message.mentions.roles.first();

        if (!theUser) return message.reply(' | **Please __Mention__ A User !**');
        if (!theRole) return message.reply(' | **Please __Mention__ A Role !**');

        theUser.roles.remove(theRole)
            .then(() => {
                message.reply("> **Done** : __Removed The Role__ ");
            })
            .catch((error) => {
                message.reply("Error : " + error.message);
            });
    }
};
