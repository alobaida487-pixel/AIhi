module.exports = {
    name: 'tbc',
    async execute(message, args, client) {
        const ownerIds = client.config.users.owner;
        if (!ownerIds.includes(message.author.id)) return;

        let tbcMessage = args.join(" ");
        if (!tbcMessage) return message.reply("** | Please Provide __A Message__ To Send To The Team**");

        const teamRole = message.guild.roles.cache.get(client.config.roles.team);
        if (!teamRole) return message.reply("** | Team role not found in config.json or server.**");

        message.reply(`** | Sending broadcast to ${teamRole.members.size} team members...**`);

        let sentCount = 0;
        teamRole.members.forEach(member => {
            member.send(`** \n ${tbcMessage} \n\n Sent by: ${message.author} **`).then(() => {
                sentCount++;
            }).catch(() => {});
        });

        setTimeout(() => {
            message.channel.send(`** | Done sent broadcast to ${sentCount} members.**`);
        }, 5000);
    }
};
