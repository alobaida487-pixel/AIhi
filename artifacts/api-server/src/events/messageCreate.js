const { EmbedBuilder } = require('discord.js');
const db = require('pro.db');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const prefix = client.config.prefix;
        const color = client.config.color;
        const line = client.config.line;
        const link = client.config.link;

        const autoRooms = client.config.channels.autoLineRooms;
        if (autoRooms && autoRooms.includes(message.channel.id)) {
            message.reply({ embeds: [new EmbedBuilder().setColor(color).setImage(line).setDescription('** **')] }).catch(() => {});
        }

        if (message.content === "مقبول") {
            message.delete().catch(() => {});
            const msg = (client.edits?.maqboolMsg || "**تم قبولك في تيم 𝐓𝐫𝐚𝐩  **\n\n**__برجاء التفاعل بشكل لائق ف السيرفر لكي لا يتم تصفيتك__** \n\n**برجاء قرائة __قوانين__ و __نيوز التيم__ و جيداً لعدم أخد ورنات**  \n> <#{rulest}> , <#{newst}>\n\n**اجباري وضع اللينك ف البايو الخاص بك بهذه الطريقه :**\n**Thailand Codes & dexero:** {link}\n\n**و أهلا بيك في <@&1340762004608258125>  **").replaceAll('{rulest}', `<#${client.config.channels.rulest}>`).replaceAll('{newst}', `<#${client.config.channels.newst}>`).replaceAll('{link}', link);
            return message.channel.send(msg);
        }
        if (message.content === "دليل") {
            message.delete().catch(() => {});
            return message.channel.send(client.edits?.daleelMsg || "> ** يرجي اجباريأ لمساعدتك بالكامل ، ارسال صوره للتحويلات عن طريق موقع التحويلات :**   \n\n\n\n> **About https://probot.io/transactions **");
        }
        if (message.content === "شفر") {
            message.delete().catch(() => {});
            return message.channel.send(client.edits?.shafferMsg || "**من فضلك قم بتشفير الجمله التي ترسلها\nوعدم السب وعدم ذكر خوادم اخرى**");
        }
        if (message.content === "مرفوض") {
            message.delete().catch(() => {});
            return message.channel.send(client.edits?.marfoodMsg || "**__تم رفضك في فريق 𝖥𝖺𝗌𝗍𝖾𝗋 𝖳𝖾𝖺𝗆__   \n\n__قم بتطوير مستواك و العمل على توفير الشروط الازمة و التقديم مره اخري__**");
        }
        if (message.content === "Map") {
            message.delete().catch(() => {});
            const msg = (client.edits?.mapMsg || "- __𝐇𝐢 𝐂𝐥𝐢𝐞𝐧𝐭 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐈𝐍 Thailand Codes & dexero__ \n\n- __ماب السيرفر__ / **Server Map** \n\n\n __𝖳𝗈 𝖮𝗋𝖽𝖾𝗋 | لطلب منتج__ :\n\n <#{order}>\n\n\n __𝖳𝗈 𝖲𝗎𝗉𝗉𝗈𝗋𝗍 | لو عندك اي مشكله__ :\n\n <#{supportt}>\n\n\n  __𝖠𝖣?? 𝖯𝗋𝗂𝖼𝖾𝗌 | اسعار الاعلانات__ :\n\n <#{adsprice}> \n\n\n __𝖳𝗈 𝖠𝗉𝗉𝗅𝗒 | للتقديم علي التيم__ :\n\n ⁠<#{applyteam}>\n   \n\n __𝖳𝗈 𝖦𝗂𝗏𝖾𝖠𝗐𝖺𝗒𝗌 | للهداية__ :\n\n <#{giveaway}>\n\n\n __𝖳𝗈 𝖥𝖾𝖾𝖽𝖻𝖺𝖼𝗄 | للتقييمات__ :\n\n <#{feedback}>\n  \n\n\n> 𝖶𝖾𝗅𝖼𝗈𝗆𝖾 𝖨𝖭 __ Dexero Store__  \n\n  > [𝗦𝗲𝗿𝘃𝗲𝗿 𝗟𝗶𝗻𝗸 :]\n\n  {link}\n    \n  \n> 𝗘𝗻𝗷𝗼𝘆 𝗕𝗿𝗼  ").replaceAll('{order}', `<#${client.config.channels.order}>`).replaceAll('{supportt}', `<#${client.config.channels.supportt}>`).replaceAll('{adsprice}', `<#${client.config.channels.adsprice}>`).replaceAll('{applyteam}', `<#${client.config.channels.applyteam}>`).replaceAll('{giveaway}', `<#${client.config.channels.giveaway}>`).replaceAll('{feedback}', `<#${client.config.channels.feedback}>`).replaceAll('{link}', link);
            return message.channel.send(msg);
        }
        if (message.content === "Sp ip") {
            return message.reply(client.edits?.spipMsg || "** > إختار Domaine لل IP تاعك**\n- __مثال__ : fast-shop.publicvm.com:7777\n\n⬅️ ** و قم بتحويل المبلغ المطلوب و هوا : ** __368422__\n\n⬅️ **روم التحويل :** https://discord.com/channels/1291668633340350515/1345738752252710964\n\nhttps://cdn.discordapp.com/attachments/1329872438611410985/1345716829351444500/standard-1.gif");
        }
        if (message.content === "sp ip") {
            return message.reply("https://cdn.discordap");
        }
        if (message.content === "$close") {
            return message.reply(`$delete`);
        }
        if (message.content === "Ws") {
            message.channel.send(client.edits?.wsMsg || "**> الـرجـاء إنـتـظـار  بـائـ؏ أخـر __لـتـوفـيـر__ طـلـبـڪ \n <@&1340762004608258125>\n\n- فـي ﺣـالـﺔ عـدم الـرد خـلال 30__ دقـيـقـة__ سـيـتـم إغـلاق الـتـذڪرة مـبـاشـرة وشـڪـرا  **");
            return message.channel.send({embeds: [new EmbedBuilder().setColor(color).setImage(line).setDescription('** **')]});
        }
        if (message.content === "تفضل" || message.content === "Tfadhel") {
            const msg = (client.edits?.tfadhelMsg || "**>  | السلام عليڪم\n>  | هـنـا طـاقـم عمـل يونيفرس ستور    \n>  | معـڪ الـبـائـ؏ {author} ڪيف يمكـنـني خدمتك  **").replaceAll('{author}', `${message.author}`);
            message.channel.send(msg);
            return message.channel.send({embeds: [new EmbedBuilder().setColor(color).setImage(line).setDescription('** **')]});
        }
        if (message.content === "Offers") {
            message.delete().catch(() => {});
            message.channel.send(client.edits?.offersMsg || "**> الـرجـاء قـومـوا بـتـنـزيـل عـروض\n> لا تـنـسـوا كـل 5 دقـائـق قـومـوا بـتـنـزيـل عـروض\n> او سـوف يـتـم الـتـنـزيـل مـن رتـبـتـك\n- <@&1177660748063842375> 📝  **");
            return message.channel.send({embeds: [new EmbedBuilder().setColor(color).setImage(line).setDescription('** **')]});
        }
        if (message.content === "حول") {
            message.delete().catch(() => {});
            message.channel.send(client.edits?.hawelMsg || "**> الـرجـاء قـم بـتـحـويـل الـمـبـلـغ الـمـطـلـوب هـنـا :\n> https://discord.com/channels/1291668633340350515/1345738752252710964 💸**");
            return message.channel.send({embeds: [new EmbedBuilder().setColor(color).setImage(line).setDescription('** **')]});
        }
        if (message.content === "Host") {
            message.channel.send(client.edits?.hostMsg || "** > إملأ البيانات و إنتضر __حتى يتم تجهيز خادمك__ ⏳\n#- __Host Name__ :\n\n#- __Username__ :\n\n#- __Password__ :\n\n#- __Emile__ :**");
            return message.channel.send({embeds: [new EmbedBuilder().setColor(color).setImage(line).setDescription('** **')]});
        }
        if (message.content === "Tag") {
            return message.channel.send(client.edits?.tagMsg || " 𝐓𝐫ا𝐩丶");
        }
        if (message.content.toLowerCase() === "link" || message.content === "لينك") {
            const msg = (client.edits?.linkMsg || "**Welcome In __Thailand Codes & dexero__ \n> link __The Server__ : {link}\n- Enjoy Bro **").replaceAll('{link}', link);
            return message.channel.send(msg || `**Welcome In...**`);
        }
        if (message.content === "لاين" || message.content.toLowerCase() === "line" || message.content === "خط") {
            message.delete().catch(() => {});
            return message.channel.send({embeds: [new EmbedBuilder().setColor(color).setImage(line).setDescription('** **')]});
        }
        if (message.content.toLowerCase() === "fb") {
            const msg = (client.edits?.fbMsg || "**Thanks For Choosing** __Thailand Codes & dexero__   \n\n> **Your Opinion Matters , Please Give** __Feedback__ **And** __Mention__ **The Name Of** __The Seller__ : {author}\n  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n- __Here__ **:**\n\n <#{feedback}>").replaceAll('{author}', `${message.author}`).replaceAll('{feedback}', client.config.channels.feedback);
            return message.reply(msg || `**Thanks For Choosing...**`);
        }
        if (message.content === "io" || message.content === "خمول") {
            message.channel.send(client.edits?.ioMsg || "**__يرجي العلم أنه في حاله الخمول في التذكره لمده 60 دقايق سوف يتم غلق __ التذكره تلقائيا من طاقم العمل  **");
            return message.delete().catch(() => {});
        }

        const teamRole = client.config.roles.team;
        const supportRole = client.config.roles.support;

        if (message.channel && message.channel.name && message.channel.name.startsWith("ticket") && message.member.roles.cache.has(teamRole)) {
            const ticketReplies = ["اتفضل", "Tfadhel", "تفضل"];
            if (ticketReplies.includes(message.content)) {
                db.add(`respond_${message.guild.id}_${message.author.id}`, 1);
                let levelll = db.get(`level_${message.author.id}`);
                if (!levelll) {
                    db.set(`level_${message.author.id}`, { xp: 0, nid: message.author.id });
                    levelll = { xp: 0 };
                }
                db.set(`level_${message.author.id}`, { xp: Math.floor(levelll.xp + 1), nid: message.author.id });
            }
        }

        if (message.member.roles.cache.has(supportRole) && message.content === "$close") {
            db.add(`closedtickets_${message.guild.id}_${message.author.id}`, 1);
            let levelll = db.get(`support_${message.author.id}`);
            if (!levelll) {
                db.set(`support_${message.author.id}`, { poi: 0, id: message.author.id });
                levelll = { poi: 0 };
            }
            db.set(`support_${message.author.id}`, { poi: Math.floor(levelll.poi + 1), id: message.author.id });
        }

        if (message.member.roles.cache.has(supportRole) && message.content.includes("$rename") && message.channel.name && message.channel.name.startsWith("ticket")) {
            db.add(`renamedtickets_${message.guild.id}_${message.author.id}`, 1);
            let levelll = db.get(`support_${message.author.id}`);
            if (!levelll) {
                db.set(`support_${message.author.id}`, { poi: 0, id: message.author.id });
                levelll = { poi: 0 };
            }
            db.set(`support_${message.author.id}`, { poi: Math.floor(levelll.poi + 1), id: message.author.id });
        }

        if (message.member.roles.cache.has(supportRole) && message.channel.id === "1264913107025657878" && message.attachments.size > 0) {
            db.add(`warngived_${message.guild.id}_${message.author.id}`, 1);
            let levelll = db.get(`support_${message.author.id}`);
            if (!levelll) {
                db.set(`support_${message.author.id}`, { poi: 0, id: message.author.id });
                levelll = { poi: 0 };
            }
            db.set(`support_${message.author.id}`, { poi: Math.floor(levelll.poi + 3), id: message.author.id });
        }

        if (message.channel.id === client.config.channels.offerroom && message.member.roles.cache.has(teamRole)) {
            db.add(`offer_${message.guild.id}_${message.author.id}`, 1);
            let levelll = db.get(`level_${message.author.id}`);
            if (!levelll) {
                db.set(`level_${message.author.id}`, { xp: 0, nid: message.author.id });
                levelll = { xp: 0 };
            }
            db.set(`level_${message.author.id}`, { xp: Math.floor(levelll.xp + 2), nid: message.author.id });
        }

        if (message.channel.id === client.config.channels.feedback && !message.content.startsWith(prefix)) {
            const feedbackEmbed = new EmbedBuilder()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`**${message.content}**`)
                .setColor(color)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setTimestamp();
            message.delete().catch(() => {});
            message.channel.send({ embeds: [feedbackEmbed] }).then(msg => {
                msg.react('❤️').catch(() => {});
                message.channel.send({ embeds: [new EmbedBuilder().setColor(color).setImage(line)] }).catch(() => {});
            });

            const user = message.mentions.members.first();
            if (user && user.roles.cache.has(teamRole) && message.author.id !== user.id) {
                db.add(`feeed_${message.guild.id}_${user.id}`, 1);
                let levelll = db.get(`level_${user.id}`);
                if (!levelll) {
                    db.set(`level_${user.id}`, { xp: 0, nid: user.id });
                    levelll = { xp: 0 };
                }
                db.set(`level_${user.id}`, { xp: Math.floor(levelll.xp + 3), nid: user.id });
            }
        }

        if (message.channel.id === client.config.channels.suggestion && !message.content.startsWith(prefix)) {
            const suggestionEmbed = new EmbedBuilder()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTitle('💡 اقتراح جديد')
                .setDescription(`**${message.content}**`)
                .setColor(color)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setTimestamp();
            message.delete().catch(() => {});
            message.channel.send({ embeds: [suggestionEmbed] }).then(msg => {
                msg.react('👍').catch(() => {});
                msg.react('👎').catch(() => {});
                message.channel.send({ embeds: [new EmbedBuilder().setColor(color).setImage(line)] }).catch(() => {});
            });
        }

        if (message.author.id === "557628352828014614" && message.channel.parentId === client.config.categories.ordercategory) {
            let member = message.mentions.members.first();
            if (member && !member.bot) {
                const roleId = client.config.roles.fastClient;
                const role = message.guild.roles.cache.get(roleId);
                if (role && !member.roles.cache.has(roleId)) {
                    member.roles.add(role.id).then(() => {
                        return message.channel.send({ content: `**Done Added __𝐅𝐚𝐬𝐭丶𝐂𝐥𝐢𝐞𝐧𝐭                      __\nTo Client : ${member.user.username}**` });
                    }).catch(() => {});
                }
            }
        }

        if (message.content.includes('has transferred') || message.content.includes('قام بتحويل') || message.content.includes('Your Tax Is')) {
            const transformEmbed = new EmbedBuilder().setImage(line).setColor(color).setDescription('** **');
            message.channel.send({ embeds: [transformEmbed] });
        }

        if (message.channel.id === client.config.channels.taxchannel && !message.content.startsWith(prefix)) {
            let args = message.content.trim();
            if (args.endsWith("m")) args = args.replace(/m/gi, "") * 1000000;
            else if (args.endsWith("k")) args = args.replace(/k/gi, "") * 1000;
            else if (args.endsWith("M")) args = args.replace(/M/gi, "") * 1000000;
            else if (args.endsWith("K")) args = args.replace(/K/gi, "") * 1000;
            else if (args.endsWith("b")) args = args.replace(/b/gi, "") * 1000000000;
            else if (args.endsWith("B")) args = args.replace(/B/gi, "") * 1000000000;
            let args2 = parseInt(args);
            if (args2 && !isNaN(args2) && args2 >= 1) {
                let tax = Math.floor(args2 * (20) / (19) + (1));
                return message.reply({ content: `\n- **Your Tax Is : __${tax}__**  ` }).catch(() => {});
            }
        }

        if (message.channel.id === "1155201710634041526" || message.channel.id === client.config.channels.offerPostRoom) {
            const anchannel = client.channels.cache.get("1153992975605563432") || client.channels.cache.get(client.config.channels.offerAnnounceRoom);
            if (anchannel) {
                let test = message.content.replaceAll("نيترو", "نيتـ رو").replaceAll("فيزا", "فيـ ـزا").replaceAll("كريدت", "كريـ ـدت").replaceAll("كرديت", "كريـ ـدت").replaceAll("كاش", "كـ ـاش").replaceAll("ستيم", "ستـ ـيم").replaceAll("سيرفر", "سيرفـ ـر").replaceAll("ديسكورد", "ديسـ ـكورد").replaceAll("حسابات", "حسابـ ـات").replaceAll("اكونتات", "اكـ ـونتات").replaceAll("بوستات", "بوستـ ـات").replaceAll("تفعيل", "تفـ ـعيل").replaceAll("نيتفليكس", "نيتفلـ ـيكس").replaceAll("سبوتيفاي", "سبوتـ ـيفاي").replaceAll("تيكتوك", "تيكـ ـتوك").replaceAll("فيسبوك", "فيسـ ـبوك").replaceAll("انستا", "انسـ ـتا").replaceAll("توكنات", "توكـ ـنات").replaceAll("فوتات", "فوتـ ـات").replaceAll("بوتات", "بوتـ ـات").replaceAll("كريبتو", "كريبتـ ـو").replaceAll("عملات", "عمـ ـلات").replaceAll("كود", "كـ ـود").replaceAll("بوت", "بـ وت").replaceAll("اكس بوكس", "اكسـ ـبوكس").replaceAll("فيز", "فيـ ـز").replaceAll("موجود", "موجـ ـود").replaceAll("اكونت", "اكـ ونـ ت").replaceAll("متوفر", "مـتـ وفر").replaceAll("سعر", "سـ ـعر").replaceAll("تيكت", "تيـ ـكت").replaceAll("تكت", "تـ كـ ـت").replaceAll("متابع", "مـ ـتـابـع").replaceAll("حساب", "حـ ـسـاب").replaceAll("بيع", "بـ ـيع").replaceAll("اعضاء", "اعـ ـضاء").replaceAll("اوتو", "اوتـ ـو").replaceAll("اوفلاين", "اوفـ ـلاين").replaceAll("اونلاين", "اونـ ـلاين").replaceAll("تيك توك", "تـ ـيك تـ ـوك").replaceAll("وهمي", "وهـ ـمي").replaceAll("استور", "اسـ ـتور").replaceAll("شاهد", "شـ ـاهـ ـد").replaceAll("نوع", "نـ ـوع").replaceAll("ستور", "شـ ـوب").replaceAll("تفاعل", "تفـ ـاعـ ـل").replaceAll("لفل", "لـ ـفـ ـل").replaceAll("ضمان", "ضـ ـمان").replaceAll("محدوده", "محـ ـدوده").replaceAll("فتره", "فـ ـتره").replaceAll("ابدي", "ابـ ـدي").replaceAll("سنه", "سـ ـنه").replaceAll("شهر", "شـ ـهر").replaceAll("شهور", "شـ ـهور").replaceAll("اسبوع", "اسـ ـبوع").replaceAll("انواع", "انـ ـواع").replaceAll("جميع", "جمـ ـيع").replaceAll("ديس", "ديـ ـس").replaceAll("كوين", "كويـ ـن").replaceAll("والت", "والـ ـت").replaceAll("سويت", "سـ ـويـ ـت").replaceAll("اسعار", "اسعـ ـار").replaceAll("ميمبر", "ميـ ـمبر").replaceAll("ميوزك", "ميـ ـوزك").replaceAll("برودكاست", "برودكـ ـاسـ ـت").replaceAll("سيستم", "سيـ ـستم").replaceAll("ميديا", "ميديـ ـا").replaceAll("خدمات", "خدمـ ـات").replaceAll("سوشيال", "شوشـ ـيال").replaceAll("توكن", "تـ ـوكن").replaceAll("نتفلكس", "نtفلكس");
                let attach = message.attachments.first();

                anchannel.send(`**~~__ ${test} __~~**\n\n\n\n\n\n\n\n\n\n\n\n\n> •  __𝐎𝐰𝐧𝐞𝐫 𝐎𝐟𝐟𝐞𝐫__ : <@${message.author.id}>\n\n> •   __𝐎𝐫𝐝𝐞𝐫 𝐓𝐢𝐜𝐤𝐞𝐭__ :   <#${client.config.channels.order}>\n\n> •  __𝐎𝐟𝐟𝐞𝐫 𝐌𝐞𝐧𝐭𝐢𝐨𝐧__  : <@&1343677425749594152>  **`)
                .then(mes => setTimeout(() => mes.delete().catch(() => {}), 43200000));

                message.reply(" | 𝐃𝐨𝐧𝐞 𝐒𝐞𝐧𝐝 𝐘𝐨𝐮𝐫 𝐎𝐟𝐟𝐞𝐫 ").catch(() => {});
                if (attach) {
                    let embed = new EmbedBuilder().setColor(color).setImage(attach.proxyURL);
                    anchannel.send({ embeds: [embed] }).then(pho => setTimeout(() => pho.delete().catch(() => {}), 43200000));
                }
                anchannel.send(client.config.line).then(lin => setTimeout(() => lin.delete().catch(() => {}), 43200000));
            }
        }

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);

        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(`Error executing command ${commandName}`, error);
            message.reply('There was an error trying to execute that command!').catch(() => {});
        }
    }
};
