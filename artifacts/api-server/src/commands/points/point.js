const db = require('pro.db');

module.exports = {
    name: 'point',
    async execute(message, args, client) {
        let user = message.mentions.members.first() || message.member;

        if (!user.roles.cache.has(client.config.roles.team)) {
            return message.reply(`> **You Are Not In Our Team**`);
        }

        let oferpint = db.get(`offer_${message.guild.id}_${user.id}`) || 0;
        let fedpint = db.get(`feeed_${message.guild.id}_${user.id}`) || 0;
        let respint = db.get(`respond_${message.guild.id}_${user.id}`) || 0;

        let levelll = db.get(`level_${user.id}`) || { xp: 0 };
        let level = levelll.xp;

        message.reply(`\n  > **Hey ${user} ** \n\n  > **Feedbacks : \`${fedpint}\`  **\n\n  > **Offers : \`${oferpint}\` ** \n\n  > **Respond Tickets : \`${respint}\` ** \n\n  > **Total Points : \`${level}\` ** \n\n  ====================\n\n  **__للمعلومه يتم احتساب النقاط عن طريق ان الفيدباك الواحد عليه 3 نقاط و الاوفر الواحد عليه نقطتين و رد التيكت الواحد عليه نقطه واحده فقط. __**`);
    }
};
