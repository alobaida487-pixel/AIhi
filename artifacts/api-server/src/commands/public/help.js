const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'help',
    async execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setTitle("**Help Menu **")
            .setColor(client.config.color)
            .setImage(client.config.line)
            .setThumbnail(message.guild.iconURL())
            .setDescription(`> **Hi , I Am __Thailand Codes & dexero__   **\n\n> **I Work For __Thailand Codes & dexero__   **\n\n> **My Developper Is __Thailand Codes & dexero__ **`);

        const selectMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('commands')
                .setPlaceholder('⚘・𝐒𝐞𝐥𝐞𝐜𝐭 𝐀 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲')
                .addOptions([
                    { label: '𝐎𝐰𝐧𝐞𝐫 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬', value: 'Owners', description: 'Commands for Owners', emoji: '👑' },
                    { label: '𝐏𝐮𝐛𝐥𝐢𝐜 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬', value: 'Public', description: 'Commands for Public', emoji: '🌍' },
                    { label: '𝐀𝐝𝐦𝐢𝐧 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬', value: 'Admins', description: 'Commands for Admins', emoji: '🛡️' },
                    { label: '𝐒𝐭𝐨𝐫𝐞 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬', value: 'Store', description: 'Commands for Store', emoji: '🏪' },
                    { label: '𝐏𝐨𝐢𝐧𝐭𝐬 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬', value: 'Points', description: 'Commands for Points', emoji: '🪙' },
                ])
        );

        const buttonsRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫').setURL('https://discord.gg/SAtTqkF9WE'),
            new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('𝐒𝐮𝐩𝐩𝐨𝐫𝐭 𝐒𝐞𝐫𝐯𝐞𝐫').setURL(client.config.link)
        );

        message.channel.send({ embeds: [embed], components: [selectMenu, buttonsRow] });
    }
};
