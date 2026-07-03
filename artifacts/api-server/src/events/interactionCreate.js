const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const db = require('pro.db');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        const color = client.config.color;
        const line = client.config.line;
        const prefix = client.config.prefix;
        const testerrole = client.config.roles.testerrole;

        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'commands') {
                const category = interaction.values[0];
                let embed = new EmbedBuilder()
                    .setColor(color)
                    .setImage(line)
                    .setThumbnail(interaction.guild.iconURL());

                if (category === 'Owners') {
                    embed.setTitle("**Owners Cmds**")
                        .setDescription(`**\n> ${prefix}setavatar \` To Change Avatar Bot \`\n> ${prefix}team \` To Mention All Members In Team \`\n> ${prefix}tbc \` To Send Broadcast For Team \`**`);
                } else if (category === 'Public') {
                    embed.setTitle("**Public Cmds**")
                        .setDescription(`** \n> ${prefix}uptime \` To Show Uptime Bot \`\n> ${prefix}link \` To Show Link Server \`\n> ${prefix}inrole \` To Show Role Member \`\n> ${prefix}dev \` To Find Out Who Made The Bot\`**`);
                } else if (category === 'Admins') {
                    embed.setTitle("**Admin Cmds**")
                        .setDescription(`**\n> ${prefix}embed \` To Make Embed Message \`\n> ${prefix}say \` To Make Say Message \`\n> ${prefix}unbanall \` To UnBan All Member \`\n> ${prefix}name \` To SetName A Member \`\n> ${prefix}lock \` To Lock Channel \`\n> ${prefix}unlock \` To UnLock Channel \`\n> ${prefix}show \` To Show Channel \`\n> ${prefix}hide \` To Hide Channel \`\n> ${prefix}ban \` To Ban Member \`\n> ${prefix}unban \` To UnBan Member \`\n> ${prefix}mute \` To Mute Member \`\n> ${prefix}unmute \` To UnMute Member \`\n> ${prefix}g-role \` To Give Role To Member \`\n> ${prefix}r-role \` To Remove Role To Member \`\n> مقبول \` To Accept Someone For Team \`\n> مرفوض \` To Reject Someone For Team \`\n> دليل \` To Get The Pro Bot Website Where You Can Find The Guide \`\n> ${prefix}bot \`To obtain a form if you are requesting a bot \`\n> ${prefix}design \` To obtain a form if you are requesting a design \`\n> ${prefix}rep \` To obtain a form if you want to inform someone \`\n> ${prefix}num \` To register the seller number \`**`);
                } else if (category === 'Store') {
                    embed.setTitle("**Store Cmds**")
                        .setDescription(`**\n> ${prefix}send \` To Send Msg DM To Member \`\n> ${prefix}come \` To Come DM To Member \`\n> ${prefix}tax \` To Show Tax A Number \`\n> ${prefix}welcome-seller \` To Welcome Seller \`\n> ${prefix}upgrade \` To Upgrade Seller \`\n> ${prefix}remove \` To Remove Seller \`\n> ${prefix}font \` To Change Word For 𝐖𝐨𝐫𝐝 \`\n> ${prefix}tag \` To Change Seller Name \`\n> For Tickets :\n> \`  Ws \`\n> \`  Fb \`\n> \`  خمول \`\n> \` تفضل \`\n> \` حول \` **`);
                } else if (category === 'Points') {
                    embed.setTitle("**Points Cmds**")
                        .setDescription(`**\n Sooon\n\n> Points Target :** \` Re - $Close - $rename - +Come - +Ws - Fb - io - تفضل \` `);
                }

                if (embed.data.title) {
                    await interaction.update({ embeds: [embed], components: interaction.message.components });
                }
            } else if (interaction.customId === 'select_language') {
                const language = interaction.values[0];

                if (language === 'arabic') {
                    const modal = new ModalBuilder()
                        .setCustomId('myModalArabic')
                        .setTitle('Apply Team Submit (Arabic)');

                    const rname = new TextInputBuilder().setCustomId('rname').setLabel('كم عمرك').setStyle(TextInputStyle.Short);
                    const age = new TextInputBuilder().setCustomId('age').setLabel('حدد كم مدة خبرتك في البيع و الشراء').setStyle(TextInputStyle.Short);
                    const svcount = new TextInputBuilder().setCustomId('svcount').setLabel('هل معك 300 ألف ضمانة ( اي , لا )').setStyle(TextInputStyle.Short);
                    const fbcount = new TextInputBuilder().setCustomId('fb').setLabel('هلا عندك فيدباكات ؟ و كم عددها').setStyle(TextInputStyle.Short);
                    const roles = new TextInputBuilder().setCustomId('roles').setLabel('ماذا سوف تبيع').setStyle(TextInputStyle.Short);

                    modal.addComponents(
                        new ActionRowBuilder().addComponents(rname),
                        new ActionRowBuilder().addComponents(age),
                        new ActionRowBuilder().addComponents(svcount),
                        new ActionRowBuilder().addComponents(fbcount),
                        new ActionRowBuilder().addComponents(roles)
                    );

                    await interaction.showModal(modal);
                } else if (language === 'ENGLISH') {
                    const modal = new ModalBuilder()
                        .setCustomId('myModalEnglish')
                        .setTitle('Apply Team Submit (English)');

                    const rname = new TextInputBuilder().setCustomId('rname').setLabel('Your Age').setStyle(TextInputStyle.Short);
                    const age = new TextInputBuilder().setCustomId('age').setLabel('How Long Do You Have Experience').setStyle(TextInputStyle.Short);
                    const svcount = new TextInputBuilder().setCustomId('svcount').setLabel('You Have 300k Guarantee').setStyle(TextInputStyle.Short);
                    const fbcount = new TextInputBuilder().setCustomId('fb').setLabel('How Much Feedback Do You Have').setStyle(TextInputStyle.Short);
                    const roles = new TextInputBuilder().setCustomId('roles').setLabel('What Will You Sell').setStyle(TextInputStyle.Short);

                    modal.addComponents(
                        new ActionRowBuilder().addComponents(rname),
                        new ActionRowBuilder().addComponents(age),
                        new ActionRowBuilder().addComponents(svcount),
                        new ActionRowBuilder().addComponents(fbcount),
                        new ActionRowBuilder().addComponents(roles)
                    );

                    await interaction.showModal(modal);
                }
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'notes') {
                await interaction.reply({
                    content: client.edits?.applyTicketNotes || `**\`ملحوظات مهمة للغاية\`\n - أهم حاجة الاحترام المتبادل بينك وبين طاقم العمل داخل السيرفر.\n - يجب أن تكون الفيدباكات من سيرفرات مشهورة وموثوق بها.\n - إذا كنت تجلب ورنات أكثر من 3 مرات، سيتم تصفيتك.\n - في حال قمت بنزع إسم أو رابط السيرفر فسيتم تصفيتك.\n - في حال غبت فجأة على العمل و التفاعل فسيتم تصفيتك.\n - في حال كان أسلوبك و معاملتك للزبائن غير لائقة فسيتم تصفيتك.\n - في حال لم تكن متفاعل في الرد التكاتت فسيتم تصفيتك.**`,
                    ephemeral: true
                });
            } else if (interaction.customId === 'mention') {
                await interaction.reply(`<@&${testerrole}>`);
            } else if (interaction.customId === 'lock' || interaction.customId === 'unlock' || interaction.customId === 'hide' || interaction.customId === 'show') {
                if (!interaction.member.permissions.has('ManageChannels')) {
                    return interaction.reply({ content: 'You do not have permissions.', ephemeral: true });
                }

                const channel = interaction.channel;
                const embed = new EmbedBuilder().setColor(color).setImage(line).setTitle('**Manage Channel**');

                let row;

                if (interaction.customId === 'lock') {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
                    embed.setDescription(`**Channel ${channel} has __been locked__**`);
                    row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('unlock').setLabel('Unlock').setStyle(ButtonStyle.Success),
                        new ButtonBuilder().setCustomId('lock').setLabel('Lock').setStyle(ButtonStyle.Danger)
                    );
                } else if (interaction.customId === 'unlock') {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: true });
                    embed.setDescription(`**Channel ${channel} has __been unlocked__**`);
                    row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('lock').setLabel('Lock').setStyle(ButtonStyle.Success),
                        new ButtonBuilder().setCustomId('unlock').setLabel('Unlock').setStyle(ButtonStyle.Danger)
                    );
                } else if (interaction.customId === 'hide') {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: false });
                    embed.setDescription(`**Channel ${channel} has __been hidden__**`);
                    row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('show').setLabel('Show').setStyle(ButtonStyle.Success),
                        new ButtonBuilder().setCustomId('hide').setLabel('Hide').setStyle(ButtonStyle.Danger)
                    );
                } else if (interaction.customId === 'show') {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: true });
                    embed.setDescription(`**Channel ${channel} has __been shown__**`);
                    row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('hide').setLabel('Hide').setStyle(ButtonStyle.Success),
                        new ButtonBuilder().setCustomId('show').setLabel('Show').setStyle(ButtonStyle.Danger)
                    );
                }

                await interaction.update({ embeds: [embed], components: [row] });
            } else if (interaction.customId === 'claim') {
                const supportRole = client.config.roles.support;
                if (!interaction.member.roles.cache.has(supportRole)) {
                    return interaction.reply({ content: 'You are not a support member.', ephemeral: true });
                }

                db.add(`supportticketclaims_${interaction.guild.id}_${interaction.user.id}`, 1);
                let levell = db.get(`support_${interaction.user.id}`) || { poi: 0 };
                db.set(`support_${interaction.user.id}`, { poi: levell.poi + 3, id: interaction.user.id });

                interaction.channel.setName(`${interaction.member.nickname || interaction.user.username}`);

                const { logEvent } = require('../utils/logger');
                let tType = 'غير معروف';
                if (interaction.channel.name.includes('order')) tType = 'order';
                else if (interaction.channel.name.includes('support')) tType = 'support';
                else if (interaction.channel.name.includes('apply')) tType = 'apply';
                await logEvent(client, 'TICKET_CLAIMED', {
                    ticketName: interaction.channel.name,
                    ticketType: tType,
                    guildId: interaction.guild.id,
                    user: interaction.user
                });

                await interaction.reply({
                    embeds: [new EmbedBuilder().setDescription(`> \`-\`**${interaction.member.nickname || interaction.user.username} | Done Claimed Ticket ✅**`)]
                });
            } else if (interaction.customId === 'confirm_close') {
                const supportRole = client.config.roles.support;
                const teamRole = client.config.roles.team;
                if (!interaction.member.roles.cache.has(supportRole) && !interaction.member.roles.cache.has(teamRole) && !interaction.member.permissions.has("Administrator")) {
                    return interaction.reply({ content: "You don't have permission to close this ticket.", ephemeral: true });
                }

                const { logEvent } = require('../utils/logger');
                let tType = 'غير معروف';
                if (interaction.channel.name.includes('order')) tType = 'order';
                else if (interaction.channel.name.includes('support')) tType = 'support';
                else if (interaction.channel.name.includes('apply')) tType = 'apply';

                await logEvent(client, 'TICKET_CLOSED', {
                    ticketName: interaction.channel.name,
                    ticketType: tType,
                    guildId: interaction.guild.id,
                    user: interaction.user
                });

                await interaction.update({ content: "**⏳ جاري إغلاق التذكرة وتجهيز السجل...**", embeds: [], components: [] }).catch(() => {});

                try {
                    await interaction.channel.send({ content: "*close soon**" }).catch(() => {});

                    let transcriptChannelId =
                        client.config.channels?.ticketTranscriptChannel ||
                        client.config.channels?.transcriptChannel ||
                        client.config.channels?.logChannel;

                    if (transcriptChannelId && typeof transcriptChannelId === 'object') {
                        transcriptChannelId = transcriptChannelId[interaction.guild.id];
                    }

                    const transcriptChannel = transcriptChannelId
                        ? client.channels.cache.get(transcriptChannelId) || await client.channels.fetch(transcriptChannelId).catch(() => null)
                        : null;

                    if (transcriptChannel) {
                        const { AttachmentBuilder } = require('discord.js');
                        const { generateTranscriptHTML } = require('../utils/transcriptGenerator');
                        const messages = await interaction.channel.messages.fetch({ limit: 100 });

                        const htmlContent = generateTranscriptHTML(messages, interaction.channel.name, interaction.guild.iconURL({ dynamic: true, size: 256 }));
                        const transcriptAttachment = new AttachmentBuilder(Buffer.from(htmlContent, 'utf-8'), { name: `transcript-${interaction.channel.name}.html` });

                        const embed = new EmbedBuilder()
                            .setTitle('🎫 Ticket Transcript')
                            .setColor(client.config.color || '#2f3136')
                            .setDescription(`**التكت:** ${interaction.channel.name}\n**النوع:** ${tType}`)
                            .setTimestamp();

                        await transcriptChannel.send({ embeds: [embed], files: [transcriptAttachment] }).catch(() => {});

                        await interaction.user.send({
                            content: `**مرحباً، تفضل نسخة مراجعة لتذكرة الدعم الخاصة بك \`${interaction.channel.name}\`:**`,
                            files: [transcriptAttachment]
                        }).catch(() => {});
                    }
                } catch (e) {
                    console.error('[transcript] Failed to generate/send transcript:', e);
                }

                await interaction.channel.send({ content: "**✅ يتم حذف التذكرة الآن...**" }).catch(() => {});
                setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
            } else if (interaction.customId === 'cancel_close') {
                await interaction.update({ content: '**تم إلغاء الإغلاق.**', embeds: [], components: [] });
            } else if (interaction.customId.startsWith('accept_apply_') || interaction.customId.startsWith('reject_apply_')) {
                const action = interaction.customId.split('_')[0];
                const userId = interaction.customId.split('_')[2];
                if (!interaction.member.permissions.has("Administrator")) {
                    return interaction.reply({ content: "You don't have permission.", ephemeral: true });
                }
                const { logEvent } = require('../utils/logger');

                if (action === 'accept') {
                    const teamRole = interaction.guild.roles.cache.get(client.config.roles.team);
                    const member = interaction.guild.members.cache.get(userId);
                    if (member && teamRole) await member.roles.add(teamRole).catch(() => {});

                    await logEvent(client, 'APPLY_ACCEPTED', {
                        guildId: interaction.guild.id,
                        user: { id: userId },
                        admin: interaction.user
                    });

                    const embed = EmbedBuilder.from(interaction.message.embeds[0])
                        .setColor('#00ff00')
                        .setFooter({ text: `✅ تم القبول بواسطة ${interaction.user.username}` });
                    await interaction.update({ content: `**تم قبول المتقدم <@${userId}>**`, embeds: [embed], components: [] });

                    if (member) {
                        const msg = (client.edits?.maqboolMsg || "**تم قبولك في تيم 𝐓𝐫𝐚𝐩  **\n\n**__برجاء التفاعل بشكل لائق ف السيرفر لكي لا يتم تصفيتك__** \n\n**برجاء قرائة __قوانين__ و __نيوز التيم__ و جيداً لعدم أخد ورنات**  \n> <#{rulest}> , <#{newst}>\n\n**اجباري وضع اللينك ف البايو الخاص بك بهذه الطريقه :**\n**Thailand Codes & dexero:** {link}\n\n**و أهلا بيك في <@&1340762004608258125>  **").replace('{link}', client.config.link).replace('{rulest}', `<#${client.config.channels.rulest}>`).replace('{newst}', `<#${client.config.channels.newst}>`);
                        member.send(msg).catch(() => {});
                    }
                } else if (action === 'reject') {
                    await logEvent(client, 'APPLY_REJECTED', {
                        guildId: interaction.guild.id,
                        user: { id: userId },
                        admin: interaction.user
                    });

                    const embed = EmbedBuilder.from(interaction.message.embeds[0])
                        .setColor('#ff0000')
                        .setFooter({ text: `❌ تم الرفض بواسطة ${interaction.user.username}` });
                    await interaction.update({ content: `**تم رفض المتقدم <@${userId}>**`, embeds: [embed], components: [] });

                    const member = interaction.guild.members.cache.get(userId);
                    if (member) {
                        member.send(client.edits?.marfoodMsg || "**__تم رفضك في فريق 𝖥𝖺𝗌𝗍𝖾𝗋 𝖳𝖾𝖺𝗆__   \n\n__قم بتطوير مستواك و العمل على توفير الشروط الازمة و التقديم مره اخري__**").catch(() => {});
                    }
                }
            } else if (interaction.customId === 'ticket_order' || interaction.customId === 'ticket_support' || interaction.customId === 'ticket_apply') {
                let categoryId;
                let channelName;
                let roleAllowed;

                if (interaction.customId === 'ticket_order') {
                    categoryId = client.config.categories.ordercategory;
                    channelName = `ticket-order`;
                    roleAllowed = client.config.roles.orderRole || client.config.roles.team;
                } else if (interaction.customId === 'ticket_support') {
                    categoryId = client.config.categories.supportcategory;
                    channelName = `ticket-support`;
                    roleAllowed = client.config.roles.supportRole || client.config.roles.support;
                } else if (interaction.customId === 'ticket_apply') {
                    categoryId = client.config.categories.applycategory;
                    channelName = `ticket-apply`;
                    roleAllowed = client.config.roles.applyRole || client.config.roles.team;
                }

                const channel = await interaction.guild.channels.create({
                    name: channelName,
                    type: 0,
                    parent: categoryId,
                    permissionOverwrites: [
                        { id: interaction.guild.id, deny: ['ViewChannel'] },
                        { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
                        { id: client.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageChannels'] },
                        { id: roleAllowed, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] }
                    ],
                });

                await interaction.reply({ content: `**Done Creating Ticket! -> ${channel}**`, ephemeral: true });

                const embed = new EmbedBuilder()
                    .setColor(client.config.color || '#0099ff')
                    .setImage(client.config.line || null)
                    .setTimestamp()
                    .setFooter({ text: 'Thailand Store • Ticket System' });

                let components = [];

                if (interaction.customId === 'ticket_order') {
                    embed.setTitle(client.edits?.orderTicketTitle || '🛒 تذكرة طلب جديدة')
                        .setDescription(client.edits?.orderTicketWelcome || "**السلام عليكم ورحمه الله وبركاته .. **  \n**معك طاقم العمل لدي يونيفرس ستور في تذكره __الطلب__ \n\n__ يرجي توضيح طلبك بالكامل بكل توضيح لكي يمكنني مساعدتك بأكمل وجهه وتأكيد طلب المنتج الخاص بك ، سوف امنشن فريق السلعه الخاص بك بطلبك ويرجي التحلي بالصبر وانتظار بائع من فريق العمل ، يرجي العلم أن في حاله عدم توافر المنتج في الوقت الحالي سيتم غلق التذكره والعمل علي توفير المنتج قريبا__ ..   **\nhttps://cdn.discordapp.com/attachments/1329872438611410985/1345716829351444500/standard-1.gif");
                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('confirm_close').setLabel('Close Ticket').setStyle(ButtonStyle.Danger)
                    );
                    components.push(row);
                } else if (interaction.customId === 'ticket_support') {
                    embed.setTitle(client.edits?.supportTicketTitle || '🛠️ تذكرة دعم فني')
                        .setDescription(client.edits?.supportTicketWelcome || "** السلام عليكم ورحمة الله وبركات \nمعك طاقم العمل 2060 __𝐔𝐧𝐢𝐯𝐞𝐫𝐬𝐞-S__ في تذكرة __الدعم الفني __     \n**__ كل ما عليك هو كتابة مشكلتك أو استفسارك وانتظار ألرد __   \n\n **لأستلام التكت اضغط علي  __ Claim__ **");
                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('claim').setLabel('Claim').setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('confirm_close').setLabel('Close Ticket').setStyle(ButtonStyle.Danger)
                    );
                    components.push(row);
                } else if (interaction.customId === 'ticket_apply') {
                    embed.setTitle(client.edits?.applyTicketTitle || '📝 تذكرة تقديم')
                        .setDescription(client.edits?.applyTicketWelcome || "**`-` السلام عليكم ورحمة الله وبركاته \n`-` معك طاقم العمل لدي __يونيفرس ستور__ في تذكرة التقديم    \n`-` برجاء تحديد جنسيتك من خلال الضغط على __القائمة الآتية__   \n**");
                    const selectMenu = new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('select_language')
                            .setPlaceholder('إضغط هنا و قم بتحديد جنسيتك و قدم لطاقم العمل')
                            .addOptions([
                                { label: 'Arabic  👈', value: 'arabic' },
                                { label: 'English  (soon)', value: 'ENGLISH' }
                            ])
                    );
                    const button = new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('notes').setLabel('ملحوظات مهمة').setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('confirm_close').setLabel('Close Ticket').setStyle(ButtonStyle.Danger)
                    );
                    components.push(selectMenu, button);
                }

                await channel.send({ content: `**Welcome ${interaction.user}**`, embeds: [embed], components: components });
            }
        }

        if (interaction.isModalSubmit()) {
            const modalId = interaction.customId;
            if (modalId === 'myModalArabic' || modalId === 'myModalEnglish') {
                const name = interaction.fields.getTextInputValue('rname');
                const exp = interaction.fields.getTextInputValue('age');
                const guarantee = interaction.fields.getTextInputValue('svcount');
                const feedback = interaction.fields.getTextInputValue('fb');
                const roles = interaction.fields.getTextInputValue('roles');

                const embed = new EmbedBuilder()
                    .setTitle('📝 تقديم جديد')
                    .setDescription(`**المتقدم:** ${interaction.user}\n\n**\`\`\` التفاصيل \`\`\`\n> العمر :  __ ${name} __\n> الخبرة :  __ ${exp} __\n> الضمان :  __ ${guarantee} __\n> الفيدباكات :  __ ${feedback} __\n> ماذا سيبيع :  __ ${roles} __**`)
                    .setColor(color)
                    .setThumbnail(interaction.guild.iconURL({ size: 128 }));

                const applyChannelId = client.config.channels?.applyteam;
                if (applyChannelId) {
                    const applyRoom = client.channels.cache.get(applyChannelId);
                    if (applyRoom) {
                        const rowApply = new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId(`accept_apply_${interaction.user.id}`).setLabel('✅ قبول').setStyle(ButtonStyle.Success),
                            new ButtonBuilder().setCustomId(`reject_apply_${interaction.user.id}`).setLabel('❌ رفض').setStyle(ButtonStyle.Danger)
                        );
                        await applyRoom.send({ content: `**تقديم جديد من ${interaction.user}**`, embeds: [embed], components: [rowApply] });
                    }
                }

                const { logEvent } = require('../utils/logger');
                await logEvent(client, 'APPLY_SUBMIT', {
                    guildId: interaction.guild.id,
                    user: interaction.user,
                    age: name,
                    exp: exp,
                    guarantee: guarantee,
                    feedback: feedback,
                    roles: roles
                });

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('notes').setLabel('Important Notes').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('mention').setLabel('Mention Staff').setStyle(ButtonStyle.Primary)
                );

                await interaction.reply({
                    content: `> **تم التقديم بنجاح. سيتم مراجعة طلبك في أقرب وقت.**`,
                    embeds: [embed],
                    components: [row]
                });
            }
        }
    }
};
