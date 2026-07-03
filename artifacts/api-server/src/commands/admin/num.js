const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'num',
    async execute(message, args, client) {
        if (!message.member.permissions.has('ManageGuild')) {
            return message.reply(`**| You don't have __permissions__ **`);
        }

        const teamRole = message.guild.roles.cache.get(client.config.roles.team);
        if (!teamRole) return message.reply("** | Team role not found.**");

        const channel = client.channels.cache.get(client.config.channels.sellernumber);
        if (!channel) return message.reply("** | Seller number channel not found in config.**");

        let index = 1;
        let description = '';

        teamRole.members.forEach(member => {
            description += `**\`${index}\` - ${member} **\n`;
            index++;
        });

        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle('**Seller Numbers**')
            .setDescription(description || 'No members with this role.')
            .setImage(client.config.line);

        channel.send({ embeds: [embed] });
        message.reply(`**| Success: Numbers calculated and sent to ${channel}.**`);
    }
};
