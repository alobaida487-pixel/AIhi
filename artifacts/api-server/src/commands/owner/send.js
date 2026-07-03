module.exports = {
    name: 'send',
    async execute(message, args, client) {
        if (!message.member.permissions.has("Administrator")) {
            return message.reply(`**❌ | You don't have __permissions__**`);
        }

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let argss = args.slice(1).join(' ');

        if (!user) return message.channel.send(`**❌ | Please mention a __member or provide__ their ID**`);
        if (!argss && message.attachments.size === 0) return message.channel.send(`**❌ | Please send __a message__**`);
        if (user.user.bot || user.id === message.author.id) return message.channel.send(`**❌ | You cannot __send a message__ to a bot or yourself**`);

        let attach = message.attachments.first();
        try {
            if (attach) {
                await user.send({ content: argss || ' ', files: [attach.url] });
            } else {
                await user.send(argss);
            }
            message.channel.send(`**  | Done, __message__ sent**`);
        } catch (error) {
            return message.channel.send(`**❌ | Can't __send a message__ to this user**`);
        }
    }
};
