module.exports = {
    name: 'team',
    async execute(message, args, client) {
        const ownerIds = client.config.users.owner;
        if (!ownerIds.includes(message.author.id)) return;

        const teamRole = client.config.roles.team;
        message.channel.send(`|| <@&${teamRole}> ||`);
    }
};
