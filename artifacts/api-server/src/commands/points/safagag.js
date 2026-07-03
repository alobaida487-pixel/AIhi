const { EmbedBuilder } = require('discord.js');
const db = require('pro.db');

module.exports = {
    name: 'safagag',
    description: 'Points Leaderboard',
    async execute(message, args, client) {
        const teamRole = client.config.roles.team;
        if (!message.member.roles.cache.has(teamRole)) return;

        let data = db.fetchAll();
        let users = [];
        for (let key in data) {
            if (data[key].xp) {
                users.push(data[key]);
            }
        }
        let new_data = users.sort((a, b) => parseFloat(b.xp) - parseFloat(a.xp));
        let num = new_data.length;
        let top = '';
        if (num > 15) num = 15;
        for (let i = 0; i < num; i++) {
            let user = message.guild.members.cache.get(new_data[i].nid);
            let username = user ? user.nickname || user.user.username : 'Unknown User';
            top += `**#${i + 1} | ${username} | ${new_data[i].xp}**\n`;
        }

        let embed = new EmbedBuilder()
            .setDescription(`${top || "No points yet!"}`)
            .setColor(client.config.color)
            .setImage(client.config.line)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            .setAuthor({ name: "Points Leaderboard", iconURL: client.user.displayAvatarURL() });

        await message.reply({ embeds: [embed] });
    }
};
