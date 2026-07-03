module.exports = {
    name: 'add',
    description: 'Add user to ticket',
    async execute(message, args, client) {
        if (!message.channel.name.startsWith('ticket') && !message.channel.name.startsWith('need') && !message.channel.name.startsWith('by') && !message.channel.name.startsWith('sell')) {
            return message.reply("** | This command can only be used in tickets.**");
        }

        const orderR = client.config.roles.orderRole;
        const supR = client.config.roles.supportRole || client.config.roles.support;
        const appR = client.config.roles.applyRole;

        let hasPermission = message.member.permissions.has("Administrator");
        if (message.channel.name.includes('order') && message.member.roles.cache.has(orderR)) hasPermission = true;
        else if (message.channel.name.includes('support') && message.member.roles.cache.has(supR)) hasPermission = true;
        else if (message.channel.name.includes('apply') && message.member.roles.cache.has(appR)) hasPermission = true;
        else if (message.member.roles.cache.has(client.config.roles.team) || message.member.roles.cache.has(client.config.roles.support)) hasPermission = true;

        if (!hasPermission) return message.reply("** | You don't have permission to manage this specific ticket.**");

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.reply("** | Please mention a user to add.**");

        await message.channel.permissionOverwrites.edit(user.id, {
            ViewChannel: true, SendMessages: true, ReadMessageHistory: true
        });

        message.reply(`**Done Added ${user} To The Ticket ✅**`);
    }
};
