const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        const welcomeRoomId = client.config.channels.welcomerooom;
        const orderId = client.config.channels.order;
        const color = client.config.color;

        if (welcomeRoomId) {
            const channel = member.guild.channels.cache.get(welcomeRoomId);
            if (channel) {
                const welcomeEmbed = new EmbedBuilder()
                    .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                    .setFooter({ text: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setDescription(`**𝐇𝐢 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐓𝐨 __Thailand Codes & dexero__ 𝐎𝐧𝐞 𝐎𝐟 𝐓𝐡𝐞 𝐁𝐞𝐬𝐭 𝐀𝐧𝐝 𝐁𝐢𝐠𝐠𝐞𝐬𝐭 𝐒𝐡𝐨𝐩𝐬 𝐈𝐧 𝐓𝐡𝐞 𝐂𝐨𝐦𝐦𝐮𝐧𝐢𝐭𝐲__.\n\n> 𝐓𝐡𝐢𝐬 __𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐇𝐞𝐥𝐩𝐢𝐧𝐠__ 𝐘𝐨𝐮 𝐓𝐨 𝐍𝐨𝐰 𝐇𝐨𝐰 𝐓𝐨 𝐔𝐬𝐞 𝐓𝐡𝐞 𝐒𝐞𝐫𝐯𝐞𝐫 𝐂𝐡𝐚𝐧𝐧𝐞𝐥𝐬. \n\n 𝐅𝐨𝐫 __𝐎𝐫𝐝𝐞𝐫__ :⁠\n<#${orderId}>\n\n 𝐘𝐨𝐮 𝐀𝐫𝐞 __𝐌𝐞𝐦𝐛𝐞𝐫 𝐍𝐮𝐦𝐛𝐞𝐫__ :  \`${member.guild.memberCount}\` 👤\n\n\n» 𝐄𝐧𝐣𝐨𝐲 <𝟑   **`)
                    .setColor(color);

                channel.send({ content: `**Hey** <@!${member.user.id}> **Welcome To ** __${member.guild.name}__ `, embeds: [welcomeEmbed] }).catch(() => {});
            }
        }

        member.send(`\n> **Welcome To** __Thailand Codes & dexero__ 👋 \n\n- **مرحبا بك نورت أحسن و أضمن ستور في الشرق الاوسط :** __Thailand Codes & dexero__\n\n- **__تعريف صغير__ : **Thailand Codes & dexero سيرفر عربي و يتوفر فيه جميع المنتوجات و الخدمات التي تحتاجها ,..\n\n **For Order :** <#${orderId}>\n\n> \`###\` 𝗘𝗻𝗷𝗼𝘆 𝗕𝗿𝗼`).catch(() => {});
    }
};
