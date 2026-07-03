module.exports = {
    name: 'e',
    async execute(message, args, client) {
        const teamRole = client.config.roles.team;
        if (!message.member.roles.cache.has(teamRole)) return;

        const nickname = message.member.nickname || message.author.username;
        if (message.channel.name.startsWith('ticket') || message.channel.name.startsWith('need') || message.channel.name.startsWith('sell') || message.channel.name.startsWith('by')) {
            try {
                const newChannelName = `by-${nickname}`;
                await message.channel.setName(newChannelName);
                await message.delete().catch(() => {});
            } catch (error) {
                console.error('Error changing channel name:', error);
            }
        }
    }
};
