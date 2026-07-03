const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'embed',
    async execute(message, args, client) {
        if (!message.member.permissions.has('ManageGuild')) {
            return message.reply(`**| You don't have __permissions__ **`);
        }

        let embedMessage = args.join(' ');
        if (!embedMessage) return message.reply('** | Please select __a message__ **');

        message.delete().catch(() => {});

        let embed = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setDescription(`${embedMessage}`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setColor(client.config.color)
            .setTimestamp()
            .setImage(client.config.line);

        message.channel.send({ embeds: [embed] });
    }
};
