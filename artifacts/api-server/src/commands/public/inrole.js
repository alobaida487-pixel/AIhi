const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'inrole',
    async execute(message, args, client) {
        let roleId = args[0];
        let trole = message.mentions.roles.first() || message.guild.roles.cache.find(role => role.id === roleId);

        if (!trole) return message.reply(`** | Please __mention role__ id**`);

        const roleMember = trole.members.map((user) => `${user.id} ${user.user.tag}`).join('\n');

        const embed = new EmbedBuilder()
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
            .setThumbnail(message.author.avatarURL({ dynamic: true }))
            .addFields([{
                name: `List of users in ${trole.name} role : (${trole.members.size})`,
                value: `**${roleMember.length > 1024 ? roleMember.substring(0, 1020) + "..." : (roleMember || "No members")}**`
            }])
            .setColor(client.config.color)
            .setImage(client.config.line)
            .setFooter({ text: `Members in this role ${trole.members.size}` });

        message.reply({ embeds: [embed] });
    }
};
