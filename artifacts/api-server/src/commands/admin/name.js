module.exports = {
    name: 'name',
    async execute(message, args, client) {
        if (!message.member.permissions.has('ManageNicknames')) {
            return message.reply('لا تمتلك الصلاحيات اللازمة لاستخدام هذا الامر !');
        }
        if (!message.guild.members.me.permissions.has('ManageNicknames')) {
            return message.reply('لا امتلك الصلاحيات اللازمة للقيام هذا الامر !');
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const name = args.slice(1).join(" ");

        if (!member) return message.reply('رجاء قم بمنشن العضو الذي تريد تغيير لقبه !');
        if (!name) return message.reply("رجاء قم بكتابة اللقب اللذي تريد وضعه للعضو !");

        member.setNickname(name).then(() => {
            message.reply(`تم تغيير اللقب إلى **${name}** بنجاح!`);
        }).catch(() => {
            message.reply('لا يمكنني تغيير اسم هذا العضو !');
        });
    }
};
