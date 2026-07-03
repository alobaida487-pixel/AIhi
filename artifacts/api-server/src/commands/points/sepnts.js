const db = require('pro.db');

module.exports = {
    name: 'sepnts',
    async execute(message, args, client) {
        let user = message.mentions.members.first() || message.member;

        if (!user.roles.cache.has(client.config.roles.support)) {
            return message.reply(`** | You Haven't Ticket __Support Role__**`);
        }

        let clpint = db.get(`closedtickets_${message.guild.id}_${user.id}`) || 0;
        let repint = db.get(`renamedtickets_${message.guild.id}_${user.id}`) || 0;
        let warpint = db.get(`warngived_${message.guild.id}_${user.id}`) || 0;
        let claimedsupporttic = db.get(`supportticketclaims_${message.guild.id}_${user.id}`) || 0;

        let levell = db.get(`support_${user.id}`) || { poi: 0 };
        let level = levell.poi || 0;

        message.reply(`\n  > **Hey ${user} ** \n\n  > **Close Tickets : \`${clpint}\` **\n\n  > **Renamed Order Tickets : \`${repint}\` ** \n\n  > **Claimed Technical Support Tickets \`${claimedsupporttic}\` ** \n\n  > **Warn Gived \`${warpint}\` ** \n\n  > **Total Points : \`${level}\` ** \n\n  ====================`);
    }
};
