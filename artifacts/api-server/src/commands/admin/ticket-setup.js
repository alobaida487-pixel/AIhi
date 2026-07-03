const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'ticket-create',
    description: 'Setup the ticket panel',
    async execute(message, args, client) {
        if (!message.member.permissions.has("Administrator")) return message.reply("Admins only.");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('ticket_order').setLabel('Order Ticket').setEmoji('🛒').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('ticket_support').setLabel('Support Ticket').setEmoji('🛠️').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('ticket_apply').setLabel('Apply Ticket').setEmoji('📝').setStyle(ButtonStyle.Success)
        );

        const embed = new EmbedBuilder()
            .setTitle(`**${client.edits?.ticketPanelTitle || '🎫 Welcome to the Ticket System'}**`)
            .setDescription(`> ${client.edits?.ticketPanelDesc || 'Please click the button below that corresponds with your needs.\n\n━━━━━━━━━━━━━━━━━━━━\n🛒 **Order Ticket**\nTo buy products or services.\n\n🛠️ **Support Ticket**\nIf you have a problem or inquiry.\n\n📝 **Apply Ticket**\nTo apply for the team.\n━━━━━━━━━━━━━━━━━━━━'}`)
            .setColor(client.config.color || '#2f3136')
            .setImage(client.config.line || null)
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }) || null)
            .setTimestamp()
            .setFooter({ text: 'Thailand Store • Ticket System' });

        await message.channel.send({ embeds: [embed], components: [row] });
        message.delete().catch(() => {});
    }
};
