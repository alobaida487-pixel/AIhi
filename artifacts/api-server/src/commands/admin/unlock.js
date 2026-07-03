const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'unlock',
    async execute(message, args, client) {
        if (!message.member.permissions.has('ManageChannels')) return;

        const unlockRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('lock').setLabel('Lock').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('unlock').setLabel('Unlock').setStyle(ButtonStyle.Danger)
        );

        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle('**Manage Channel**')
            .setDescription(`**Channel ${message.channel} has __been unlocked__  **`)
            .setImage(client.config.line);

        await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: true });
        await message.channel.send({ embeds: [embed], components: [unlockRow] });
    }
};
