const { EmbedBuilder } = require('discord.js');
const db = require('pro.db');

module.exports = {
    name: 'rank',
    description: 'View Your or another user\'s rank points',
    async execute(message, args, client) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let levelll = db.get(`level_${user.id}`) || { xp: 0 };
        let support = db.get(`support_${user.id}`) || { poi: 0 };

        let embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setImage(client.config.line)
            .setAuthor({ name: user.user.username, iconURL: user.user.displayAvatarURL() })
            .setDescription(`> **XP Points:** \`${levelll.xp || 0}\`\n> **Support POI:** \`${support.poi || 0}\``)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
