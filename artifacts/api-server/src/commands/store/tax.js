const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'tax',
    async execute(message, args, client) {
        let amountStr = args[0];
        if (!amountStr) return message.reply(`> **Error It Must Be A __Number__  **`);

        if (amountStr.endsWith("m")) amountStr = amountStr.replace(/m/gi, "") * 1000000;
        else if (amountStr.endsWith("k")) amountStr = amountStr.replace(/k/gi, "") * 1000;
        else if (amountStr.endsWith("M")) amountStr = amountStr.replace(/M/gi, "") * 1000000;
        else if (amountStr.endsWith("K")) amountStr = amountStr.replace(/K/gi, "") * 1000;
        else if (amountStr.endsWith("b")) amountStr = amountStr.replace(/b/gi, "") * 1000000000;
        else if (amountStr.endsWith("B")) amountStr = amountStr.replace(/B/gi, "") * 1000000000;

        let amount = parseInt(amountStr);
        if (isNaN(amount) || amount < 1) return message.reply(`> **Error It Must Be __Larger__ Than 1  **`);

        let tax1 = Math.floor(amount * (20) / (19) + (1));
        let tax2 = Math.floor(amount * (20) / (19) + (1) - amount);
        let tax3 = Math.floor(tax2 * (20) / (19) + (1));
        let tax4 = Math.floor(tax2 + tax3 + amount);

        let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`mediator_tax`).setLabel("Mediator").setStyle(ButtonStyle.Success)
        );
        let row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`back_tax`).setLabel("Back").setStyle(ButtonStyle.Danger)
        );

        const msg = (" > **Your Tax Is : {tax}  **").replaceAll('{tax}', `${tax1}`);
        let m = await message.reply({ content: msg, components: [row] });

        const filter = i => i.user.id === message.author.id;
        const collector = m.createMessageComponentCollector({ filter, time: 3600000, max: 2 });

        collector.on('collect', async i => {
            if (i.customId === 'mediator_tax') {
                await i.update({ content: `> **Your Tax Is : __${tax4}__**`, components: [row2] });
            } else if (i.customId === 'back_tax') {
                await i.update({ content: `> **Your Tax Is : ${tax1}  **`, components: [row] });
            }
        });
    }
};
