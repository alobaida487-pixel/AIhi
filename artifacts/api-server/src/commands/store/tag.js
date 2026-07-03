module.exports = {
    name: 'tag',
    async execute(message, args, client) {
        if (!message.member.permissions.has('ManageNicknames')) {
            return message.reply('لا تمتلك الصلاحيات اللازمة لاستخدام هذا الامر !');
        }

        const user = message.mentions.members.first();
        if (!user) return message.reply("** | Please __Mention__ User**");

        const name = args.slice(1).join(" ");
        if (!name) return message.reply("** | Please __Type__ Name**");

        const tag = "𝐃𝐞𝐱𝐞𝐫𝐨丶" + name;

        user.setNickname(tag).then(() => {
            message.channel.send(`** Done Change __Name__ To ${user}**`);
        }).catch(err => {
            message.reply(`** Error __${err.message}__**`);
        });
    }
};
