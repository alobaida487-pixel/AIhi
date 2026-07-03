module.exports = {
    name: 'تشفير',
    async execute(message, args, client) {
        if (args.length === 0) {
            return message.reply("** | من فضلك اكتب __الرسالة__ التي تريد تشفيرها..**");
        }

        let content = args.join(" ");

        content = content.replaceAll("نيترو", "نيتـ رو").replaceAll("فيزا", "فيـ ـزا").replaceAll("كريدت", "كريـ ـدت").replaceAll("كرديت", "كريـ ـدت").replaceAll("كاش", "كـ ـاش").replaceAll("ستيم", "ستـ ـيم").replaceAll("سيرفر", "سيرفـ ـر").replaceAll("ديسكورد", "ديسـ ـكورد").replaceAll("حسابات", "حسابـ ـات").replaceAll("اكونتات", "اكـ ـونتات").replaceAll("بوستات", "بوستـ ـات").replaceAll("تفعيل", "تفـ ـعيل").replaceAll("نيتفليكس", "نيتفلـ ـيكس").replaceAll("سبوتيفاي", "سبوتـ ـيفاي").replaceAll("تيكتوك", "تيكـ ـتوك").replaceAll("فيسبوك", "فيسـ ـبوك").replaceAll("انستا", "انسـ ـتا").replaceAll("توكنات", "توكـ ـنات").replaceAll("فوتات", "فوتـ ـات").replaceAll("بوتات", "بوتـ ـات").replaceAll("كريبتو", "كريبتـ ـو").replaceAll("عملات", "عمـ ـلات").replaceAll("كود", "كـ ـود").replaceAll("بوت", "بـ وت").replaceAll("اكس بوكس", "اكسـ ـبوكس").replaceAll("فيز", "فيـ ـز").replaceAll("موجود", "موجـ ـود").replaceAll("اكونت", "اكـ ونـ ت").replaceAll("متوفر", "مـتـ وفر").replaceAll("سعر", "سـ ـعر").replaceAll("تيكت", "تيـ ـكت").replaceAll("تكت", "تـ كـ ـت").replaceAll("متابع", "مـ ـتـابـع").replaceAll("حساب", "حـ ـسـاب").replaceAll("بيع", "بـ ـيع").replaceAll("اعضاء", "اعـ ـضاء").replaceAll("اوتو", "اوتـ ـو").replaceAll("اوفلاين", "اوفـ ـلاين").replaceAll("اونلاين", "اونـ ـلاين").replaceAll("تيك توك", "تـ ـيك تـ ـوك").replaceAll("وهمي", "وهـ ـمي").replaceAll("استور", "اسـ ـتور").replaceAll("شاهد", "شـ ـاهـ ـد").replaceAll("نوع", "نـ ـوع").replaceAll("ستور", "شـ ـوب").replaceAll("تفاعل", "تفـ ـاعـ ـل").replaceAll("لفل", "لـ ـفـ ـل").replaceAll("ضمان", "ضـ ـمان").replaceAll("محدوده", "محـ ـدوده").replaceAll("فتره", "فـ ـتره").replaceAll("ابدي", "ابـ ـدي").replaceAll("سنه", "سـ ـنه").replaceAll("شهر", "شـ ـهر").replaceAll("شهور", "شـ ـهور").replaceAll("اسبوع", "اسـ ـبوع").replaceAll("انواع", "انـ ـواع").replaceAll("جميع", "جمـ ـيع").replaceAll("ديس", "ديـ ـس").replaceAll("كوين", "كويـ ـن").replaceAll("والت", "والـ ـت").replaceAll("سويت", "سـ ـويـ ـت").replaceAll("اسعار", "اسعـ ـار").replaceAll("ميمبر", "ميـ ـمبر").replaceAll("ميوزك", "ميـ ـوزك").replaceAll("برودكاست", "برودكـ ـاسـ ـت").replaceAll("سيستم", "سيـ ـستم").replaceAll("ميديا", "ميديـ ـا").replaceAll("خدمات", "خدمـ ـات").replaceAll("سوشيال", "شوشـ ـيال").replaceAll("توكن", "تـ ـوكن").replaceAll("نتفلكس", "نtفلكس");

        const reply = await message.reply("**تم إرسال __الرسالة بالتشفير__ في الخاص  **");
        message.author.send(content).then(() => {
            setTimeout(() => { message.delete().catch(() => {}); }, 10000);
            setTimeout(() => { reply.delete().catch(() => {}); }, 10000);
        }).catch(() => {
            message.channel.send("**لا أستطيع إرسال الرسالة في الخاص! تأكد من تفعيل الرسائل الخاصة.**");
        });
    }
};
