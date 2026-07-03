const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'welcome-seller',
    async execute(message, args, client) {
        const ownerIds = client.config.users.owner;
        if (!ownerIds.includes(message.author.id)) {
            return message.reply(`** | This Command __Only Hight Rank__**`);
        }
        if (!message.member.permissions.has('ManageRoles')) {
            return message.reply(`** | Your Dont't Have __Perm__ In Role**`);
        }

        const user = message.mentions.users.first();
        const roleArg = args.slice(1).join(" ");

        if (!user) return message.reply("** > Pls __Mention__ Seller**");
        if (!roleArg) return message.reply("** | Pls __Mention__ Roles seller**");

        const welcomeRoomId = client.config.channels.welcomesellerroom;
        const welcomeChannel = client.channels.cache.get(welcomeRoomId);

        if (welcomeChannel) {
            const msg = (" || @everyone ||\n\n> **Welcome To Team Of __Thailand Codes & dexero__ **\n\n **Seller : {user}** \n **Seller Role : {role}** \n **Read The __Rules__ To Avoid Take __Warns__ <#{rulest}> **\n **Thank You To Apply To __Fast𝖾𝗋 Team__ **\n\n **𝖤𝗇𝗃𝗈𝗒 <3   **").replaceAll('{user}', `${user}`).replaceAll('{role}', `${roleArg}`).replaceAll('{rulest}', `<#${client.config.channels.rulest}>`);
            await welcomeChannel.send(msg);
            await welcomeChannel.send({ embeds: [new EmbedBuilder().setImage(client.config.line).setColor(client.config.color)] });
        }

        message.reply("> **𝖣𝗈𝗇𝖾** : __Adding The Welcome Of The Seller__  ");
    }
};
