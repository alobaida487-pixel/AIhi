const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'show',
    async execute(message, args, client) {
        if (!message.member.permissions.has('ManageChannels')) return;

        const showRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('hide').setLabel('Hide').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('show').setLabel('Show').setStyle(ButtonStyle.Danger)
        );

        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle('**Manage Channel**')
            .setDescription(`**Channel ${message.channel} has __been shown__  **`)
            .setImage(client.config.line);

        await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { ViewChannel: true });
        await message.channel.send({ embeds: [embed], components: [showRow] });
    }
};
