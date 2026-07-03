const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log(`================`);
        console.log(``);
        console.log(`Bot Name : ${client.user.username}`);
        console.log(`Bot Tag : ${client.user.tag}`);
        console.log(`Bot Id : ${client.user.id}`);
        console.log(`Servers Count : ${client.guilds.cache.size}`);
        console.log(`Users Count : ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`);
        console.log(``);
        console.log(`================`);

        const statuses = [`Thailand Codes & dexero 𝐎𝐍 𝐓𝐎𝐏`, `𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐩𝐞𝐝 𝐁𝐲 : Thailand Codes & dexero`];
        let timer = 2;
        setInterval(() => {
            const amount = Math.floor(Math.random() * statuses.length);
            client.user.setActivity(statuses[amount], { type: 1, url: 'https://www.twitch.tv/5fr3' });
        }, timer * 1000);

        if (client.config.channels.voiceChannel) {
            setInterval(async () => {
                const channel = client.channels.cache.get(client.config.channels.voiceChannel);
                if (channel) {
                    try {
                        joinVoiceChannel({
                            channelId: channel.id,
                            guildId: channel.guild.id,
                            adapterCreator: channel.guild.voiceAdapterCreator
                        });
                    } catch (error) {}
                }
            }, 5000);
        }

        setInterval(() => {
            if (!client.config.channels.offerAnnounceRoom) return;
            const channel = client.channels.cache.get(client.config.channels.offerAnnounceRoom);
        }, 600000);
    }
};
