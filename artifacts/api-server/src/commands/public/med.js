const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'med',
    async execute(message, args, client) {
        message.delete().catch(() => {});
        const embed = new EmbedBuilder()
            .setTitle(`${message.guild.name} Team Requirements`)
            .setDescription(`\`-\`  للحصول على __وسيط__ قم باملاء الاستماره حتي نستطيع اكمال عمليه الوسطه 🛡️\n\n- **ايدي البائع للوسيط** :\n- **نوع السلعة** :\n- **سعر السلعة** :\n- **الضرائب على من** :`)
            .setFooter({ text: `${message.guild.name} Requirements`, iconURL: message.guild.iconURL() })
            .setTimestamp()
            .setColor(client.config.color)
            .setThumbnail(message.guild.iconURL());

        message.channel.send({ embeds: [embed] });
    }
};
