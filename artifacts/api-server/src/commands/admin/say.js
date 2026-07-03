module.exports = {
    name: 'say',
    async execute(message, args, client) {
        if (!message.member.permissions.has('ManageGuild')) {
            return message.reply(`**| You don't have __permissions__ **`);
        }

        let sayMessage = args.join(' ');
        if (!sayMessage) return message.reply('** | Please select __a message__ **');

        message.delete().catch(() => {});
        message.channel.send(sayMessage);
    }
};
