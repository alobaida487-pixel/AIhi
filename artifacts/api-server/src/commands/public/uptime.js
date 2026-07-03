const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'uptime',
    async execute(message, args, client) {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply(`**you don't have permissions**`);
        }

        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let s = Math.floor(client.uptime / 1000) % 60;

        let ip = `${days} days,  ${hours} hours,  ${minutes} minutes,  ${s} seconds,`;

        let embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setImage(client.config.line)
            .setTitle(`uptime:`)
            .setDescription(`**${ip}**`)
            .setThumbnail(client.user.avatarURL())
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
