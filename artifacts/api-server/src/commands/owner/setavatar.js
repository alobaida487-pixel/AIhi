module.exports = {
    name: 'setavatar',
    async execute(message, args, client) {
        const ownerIds = client.config.users.owner;
        if (!ownerIds.includes(message.author.id)) return;

        let avLink = args[0];
        if (!avLink) return message.channel.send("** | Incorrect Link, __Please Put Avatar__ Link!**");

        console.log(`Changing __bot avatar__ to: ${avLink}`);

        client.user.setAvatar(avLink).then(() => {
            message.delete().catch(() => {});
            message.channel.send('**Bot Avatar __Has Been Changed__  **');
        }).catch(() => {
            message.channel.send('**Error, Try Again Later! ❌: Incorrect Link __Or Ratelimit__**');
        });
    }
};
