const { EmbedBuilder } = require('discord.js');
const db = require('pro.db');

module.exports = {
    name: 'pnt',
    description: 'Support Points Leaderboard',
    async execute(message, args, client) {
        const supportRole = client.config.roles.support;
        if (!message.member.roles.cache.has(supportRole)) return;

        let data = db.fetchAll();
        let users = [];
        for (let key in data) {
            if (data[key].poi) {
                users.push(data[key]);
            }
        }
        let new_data = users.sort((a, b) => parseFloat(b.poi) - parseFloat(a.poi));
        let num = new_data.length;
        let top = '';
        if (num > 15) num = 15;
        for (let i = 0; i < num; i++) {
            let user = message.guild.members.cache.get(new_data[i].id);
            let username = user ? user.nickname || user.user.username : 'Unknown User';
            top += `**#${i + 1} | ${username} | ${new_data[i].poi}**\n`;
        }

        let embed = new EmbedBuilder()
            .setDescription(`${top || "No points yet!"}`)
            .setColor(client.config.color)
            .setImage(client.config.line)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            .setAuthor({ name: "Support Points Leaderboard", iconURL: client.user.displayAvatarURL() });

        await message.reply({ embeds: [embed] });
    }
};
