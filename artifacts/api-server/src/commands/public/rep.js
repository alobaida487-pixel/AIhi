const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'rep',
    async execute(message, args, client) {
        message.delete().catch(() => {});
        const embed = new EmbedBuilder()
            .setTitle(`${message.guild.name} Team Requirements`)
            .setDescription(client.edits?.repMsg || `\`-\` للتبليغ علي سيلر قم باملاء **الاستماره** حتي نستطيع **تعويضك** ❗\n\n- صاحب **البلاغ** :\n- إسم **السيلر** :\n- ايدي **السيلر** :\n- فسر ماذا **حدث** :\n- قم بإرسال **الدلائل** مع دليل **التحويل** :`)
            .setFooter({ text: `${message.guild.name} Requirements`, iconURL: message.guild.iconURL() })
            .setTimestamp()
            .setColor(client.config.color)
            .setThumbnail(message.guild.iconURL());

        message.channel.send({ embeds: [embed] });
    }
};
