const db = require('pro.db');

module.exports = {
    name: 'addpoint',
    description: 'Add points to a user',
    async execute(message, args, client) {
        const owners = client.config.owners || [];
        if (!owners.includes(message.author.id) && !message.member.permissions.has("Administrator")) {
            return message.reply("** | This Command Only For Owners/Admins**");
        }

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.reply("** | Please mention a user**");

        const type = args[1] ? args[1].toLowerCase() : null;
        if (type !== 'xp' && type !== 'poi') return message.reply("** | Please specify point type: `xp` or `poi`**");

        const amount = parseInt(args[2]);
        if (!amount || isNaN(amount)) return message.reply("** | Please provide a valid amount**");

        if (type === 'xp') {
            let levelll = db.get(`level_${user.id}`) || { xp: 0, nid: user.id };
            db.set(`level_${user.id}`, { xp: levelll.xp + amount, nid: user.id });
        } else if (type === 'poi') {
            let levelll = db.get(`support_${user.id}`) || { poi: 0, id: user.id };
            db.set(`support_${user.id}`, { poi: levelll.poi + amount, id: user.id });
        }

        message.reply(`**Done Added __${amount}__ ${type.toUpperCase()} To ${user}**`);
    }
};
