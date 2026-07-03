const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    const sendLog = async (guild, embed) => {
        let logChannelId = client.config.channels?.logChannel;
        if (logChannelId && typeof logChannelId === 'object' && guild.id) {
            logChannelId = logChannelId[guild.id];
        }
        if (!logChannelId) return;
        const logChannel = client.channels.cache.get(logChannelId) || await client.channels.fetch(logChannelId).catch(() => null);
        if (logChannel) {
            logChannel.send({ embeds: [embed] }).catch(() => {});
        }
    };

    client.on('messageDelete', async (message) => {
        if (!message.guild || message.author?.bot) return;
        const embed = new EmbedBuilder()
            .setTitle('🗑️ رسالة محذوفة')
            .setColor('#ff0000')
            .setDescription(`**المستخدم:** <@${message.author?.id}>\n**الروم:** <#${message.channel.id}>\n\n**المحتوى:**\n${message.content || 'رسالة بدون نص (ربما صورة)'}`)
            .setTimestamp();
        await sendLog(message.guild, embed);
    });

    client.on('messageUpdate', async (oldMessage, newMessage) => {
        if (!oldMessage.guild || oldMessage.author?.bot || oldMessage.content === newMessage.content) return;
        const embed = new EmbedBuilder()
            .setTitle('📝 رسالة معدلة')
            .setColor('#ffff00')
            .setDescription(`**المستخدم:** <@${oldMessage.author?.id}>\n**الروم:** <#${oldMessage.channel.id}>\n\n**قبل:**\n${oldMessage.content || 'بدون نص'}\n\n**بعد:**\n${newMessage.content || 'بدون نص'}`)
            .setTimestamp();
        await sendLog(oldMessage.guild, embed);
    });

    client.on('channelCreate', async (channel) => {
        if (!channel.guild) return;
        const embed = new EmbedBuilder()
            .setTitle('📁 روم جديدة')
            .setColor('#00ff00')
            .setDescription(`**اسم الروم:** ${channel.name}\n**النوع:** ${channel.type}\n**أيدي الروم:** ${channel.id}`)
            .setTimestamp();
        await sendLog(channel.guild, embed);
    });

    client.on('channelDelete', async (channel) => {
        if (!channel.guild) return;
        const embed = new EmbedBuilder()
            .setTitle('🗑️ روم محذوفة')
            .setColor('#ff0000')
            .setDescription(`**اسم الروم:** ${channel.name}\n**النوع:** ${channel.type}\n**أيدي الروم:** ${channel.id}`)
            .setTimestamp();
        await sendLog(channel.guild, embed);
    });

    client.on('roleCreate', async (role) => {
        const embed = new EmbedBuilder()
            .setTitle('🛡️ رتبة جديدة')
            .setColor('#00ff00')
            .setDescription(`**اسم الرتبة:** ${role.name}\n**أيدي الرتبة:** ${role.id}`)
            .setTimestamp();
        await sendLog(role.guild, embed);
    });

    client.on('roleDelete', async (role) => {
        const embed = new EmbedBuilder()
            .setTitle('🗑️ رتبة محذوفة')
            .setColor('#ff0000')
            .setDescription(`**اسم الرتبة:** ${role.name}\n**أيدي الرتبة:** ${role.id}`)
            .setTimestamp();
        await sendLog(role.guild, embed);
    });

    client.on('guildMemberAdd', async (member) => {
        const embed = new EmbedBuilder()
            .setTitle('📥 عضو جديد إنضم')
            .setColor('#00ff00')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`**المستخدم:** <@${member.id}>\n**تاريخ إنشاء الحساب:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`)
            .setTimestamp();
        await sendLog(member.guild, embed);
    });

    client.on('guildMemberRemove', async (member) => {
        const embed = new EmbedBuilder()
            .setTitle('📤 عضو غادر')
            .setColor('#ff0000')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`**المستخدم:** <@${member.id}> (${member.user.username})\n**أيدي العضو:** ${member.id}`)
            .setTimestamp();
        await sendLog(member.guild, embed);
    });
};
