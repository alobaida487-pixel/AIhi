const { EmbedBuilder } = require('discord.js');

module.exports = {
    async logEvent(client, eventType, data) {
        let logChannelId = client.config.channels?.logChannel;

        if (logChannelId && typeof logChannelId === 'object' && data?.guildId) {
            logChannelId = logChannelId[data.guildId];
        }

        if (!logChannelId) return;

        const logChannel = client.channels.cache.get(logChannelId) || await client.channels.fetch(logChannelId).catch(() => null);
        if (!logChannel) return;

        let embed = new EmbedBuilder().setTimestamp();

        switch (eventType) {
            case 'APPLY_SUBMIT':
                embed.setTitle(client.edits?.logApplySubmit || '📝 تقديم جديد مسجل')
                    .setColor('#ffff00')
                    .setDescription(`**المستخدم:** <@${data.user.id}>\n**العمر:** ${data.age}\n**الخبرة:** ${data.exp}\n**الضمان:** ${data.guarantee}\n**الفيدباكات:** ${data.feedback}\n**ما سيبيعه:** ${data.roles}`);
                break;
            case 'APPLY_ACCEPTED':
                embed.setTitle(client.edits?.logApplyAccept || '✅ قبول تقديم')
                    .setColor('#00ff00')
                    .setDescription(`**المستخدم:** <@${data.user.id}>\n**تم القبول بواسطة:** <@${data.admin.id}>`);
                break;
            case 'APPLY_REJECTED':
                embed.setTitle(client.edits?.logApplyReject || '❌ رفض تقديم')
                    .setColor('#ff0000')
                    .setDescription(`**المستخدم:** <@${data.user.id}>\n**تم الرفض بواسطة:** <@${data.admin.id}>`);
                break;
            case 'TICKET_CLOSED':
                embed.setTitle('🔒 إغلاق تكت')
                    .setColor('#ff9900')
                    .setDescription(`**التكت:** ${data.ticketName}\n**النوع:** ${data.ticketType}\n**تم الإغلاق بواسطة:** <@${data.user.id}>`);
                break;
            case 'TICKET_CLAIMED':
                embed.setTitle('🙋 استلام تكت')
                    .setColor('#0099ff')
                    .setDescription(`**التكت:** ${data.ticketName}\n**النوع:** ${data.ticketType}\n**تم الاستلام بواسطة:** <@${data.user.id}>`);
                break;
            default:
                embed.setTitle('حدث غير معروف').setDescription(JSON.stringify(data));
        }

        try {
            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending log:', error);
        }
    }
};
