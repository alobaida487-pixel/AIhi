const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'lock',
    async execute(message, args, client) {
        if (!message.member.permissions.has('ManageChannels')) return;

        const lockRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('unlock').setLabel('Unlock').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('lock').setLabel('Lock').setStyle(ButtonStyle.Danger)
        );

        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle('**Manage Channel**')
            .setDescription(`**Channel ${message.channel} has __been locked__  **`)
            .setImage(client.config.line);

        await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
        await message.channel.send({ embeds: [embed], components: [lockRow] });
    }
};
