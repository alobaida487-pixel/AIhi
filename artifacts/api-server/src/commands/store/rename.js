const db = require('pro.db');

module.exports = {
    name: 'rename',
    description: 'Rename a ticket',
    async execute(message, args, client) {
        if (!message.channel.name.startsWith('ticket') && !message.channel.name.startsWith('need') && !message.channel.name.startsWith('by') && !message.channel.name.startsWith('sell')) {
            return message.reply("This is not a ticket channel.");
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

        const newName = args.join("-");
        if (!newName) return message.reply("**Please enter a new name.**");

        if (message.member.roles.cache.has(supR) && !message.channel.name.includes('order') && !message.channel.name.includes('apply')) {
            db.add(`renamedtickets_${message.guild.id}_${message.author.id}`, 1);
            let levelll = db.get(`support_${message.author.id}`) || { poi: 0 };
            db.set(`support_${message.author.id}`, { poi: Math.floor(levelll.poi + 1), id: message.author.id });
        }

        await message.channel.setName(newName).catch(console.error);
        message.reply(`**Done Renamed Ticket To \`${newName}\` ✅**`).catch(() => {});
    }
};
