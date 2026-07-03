const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('pro.db');

module.exports = {
    name: 'close',
    description: 'Close a ticket',
    async execute(message, args, client) {
        if (!message.channel.name.startsWith('ticket') && !message.channel.name.startsWith('need') && !message.channel.name.startsWith('by') && !message.channel.name.startsWith('sell')) {
            return message.reply("This is not a ticket!");
        }

        const orderR = client.config.roles.orderRole;
        const supR = client.config.roles.supportRole || client.config.roles.support;
        const appR = client.config.roles.applyRole;

        let hasPermission = message.member.permissions.has("Administrator");
        if (message.channel.name.includes('order') && message.member.roles.cache.has(orderR)) hasPermission = true;
        else if (message.channel.name.includes('support') && message.member.roles.cache.has(supR)) hasPermission = true;
        else if (message.channel.name.includes('apply') && message.member.roles.cache.has(appR)) hasPermission = true;
        else if (message.member.roles.cache.has(client.config.roles.team) || message.member.roles.cache.has(client.config.roles.support)) hasPermission = true;

        if (!hasPermission) return message.reply("** | You don't have permission to manage this specific ticket.**");

        if (message.member.roles.cache.has(supR) && !message.channel.name.includes('order') && !message.channel.name.includes('apply')) {
            db.add(`closedtickets_${message.guild.id}_${message.author.id}`, 1);
            let levelll = db.get(`support_${message.author.id}`) || { poi: 0 };
            db.set(`support_${message.author.id}`, { poi: Math.floor(levelll.poi + 1), id: message.author.id });
        }

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('confirm_close').setLabel('✅ تأكيد الإغلاق').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('cancel_close').setLabel('❌ إلغاء').setStyle(ButtonStyle.Secondary)
        );

        const embed = new EmbedBuilder()
            .setTitle('🔒 إغلاق التذكرة')
            .setDescription(`**${client.edits?.closeTicketDesc || 'هل أنت متأكد من إغلاق هذه التذكرة؟ لن يمكن التراجع عن هذا الإجراء.'}**`)
            .setColor('#FF0000')
            .setImage(client.config.line || null)
            .setThumbnail(message.guild.iconURL() || null)
            .setTimestamp();

        message.reply({ embeds: [embed], components: [row] });
    }
};
