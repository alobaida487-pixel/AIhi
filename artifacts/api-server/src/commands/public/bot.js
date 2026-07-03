module.exports = {
    name: 'bot',
    async execute(message, args, client) {
        message.reply(client.edits?.botMsg || `** > اهلا بك برجائ ملئ  القائمه لمساعده المبرمج \n\n 1- قم بكتابة اسم البوت :\n\n 2- قم بإرسال صوره / بنر / خط البوت :\n\n 3- قم بتحديد Prefix البوت : + / - / = / $ / . / ؟ / !\n\nبرجاء الصبر حتي ينتهي المبرمج من البوت الخاص بك  **`);
    }
};
