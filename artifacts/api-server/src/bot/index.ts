import {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  Collection,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  PermissionFlagsBits,
  type Interaction,
  type Message,
  type TextChannel,
  type GuildMember,
} from "discord.js";
import axios from "axios";
import _ms from "ms";
const ms = _ms as unknown as (val: string) => number;
import { logger } from "../lib/logger.js";
import { db } from "./db.js";
import { MESSAGES, Category, OffersRoles, Sellers } from "./messages.js";
import { setStatus } from "./status.js";

// ─── startBot ─────────────────────────────────────────────────────────────────

export async function startBot(): Promise<void> {
  const token = process.env["DISCORD_BOT_TOKEN"];
  if (!token) {
    logger.warn("DISCORD_BOT_TOKEN not set — bot disabled");
    return;
  }

  setStatus({ enabled: true });

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Channel],
  });

  // ─── Slash commands registration ──────────────────────────────────────────

  const commands = [
    new SlashCommandBuilder()
      .setName("setprefix")
      .setDescription("تحديد بريفكس البوت")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .addStringOption((o) =>
        o.setName("prefix").setDescription("حدد البريفكس الجديد للبوت").setRequired(true),
      )
      .toJSON(),
    new SlashCommandBuilder()
      .setName("autotax")
      .setDescription("تحديد روم الضرائب التلقائية")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addChannelOption((o) =>
        o
          .setName("channel")
          .setDescription("حدد روم الضرائب التلقائية")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true),
      )
      .toJSON(),
    new SlashCommandBuilder()
      .setName("setmode")
      .setDescription("تحديد نظام النشر")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addStringOption((o) =>
        o
          .setName("mode")
          .setDescription("اختر نظام النشر")
          .setRequired(true)
          .addChoices(
            { name: "سيرفرات الشوب", value: "shops" },
            { name: "سيرفرات الاستور", value: "store" },
          ),
      )
      .toJSON(),
    new SlashCommandBuilder()
      .setName("setfeedback")
      .setDescription("تحديد روم الفيدباك")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addChannelOption((o) =>
        o
          .setName("channel")
          .setDescription("حدد روم الفيدباك")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true),
      )
      .toJSON(),
    new SlashCommandBuilder()
      .setName("setoffers")
      .setDescription("تحديد روم العروض")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addChannelOption((o) =>
        o
          .setName("channel")
          .setDescription("تحديد روم العروض")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true),
      )
      .toJSON(),
    new SlashCommandBuilder()
      .setName("setsuggestion")
      .setDescription("تحديد روم الاقتراحات")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addChannelOption((o) =>
        o
          .setName("channel")
          .setDescription("حدد روم الاقتراحات")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true),
      )
      .toJSON(),
    new SlashCommandBuilder()
      .setName("offersinfo")
      .setDescription("عرض معلومات العروض")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .addStringOption((o) =>
        o.setName("id").setDescription("حدد ايدي العرض").setRequired(true),
      )
      .toJSON(),
  ];

  // ─── Ready ────────────────────────────────────────────────────────────────

  client.once(Events.ClientReady, async (c) => {
    logger.info({ tag: c.user.tag }, "Discord bot is ready");
    setStatus({ connected: true, tag: c.user.tag, error: null });

    const rest = new REST({ version: "10" }).setToken(token);
    try {
      await rest.put(Routes.applicationCommands(c.user.id), { body: commands });
      logger.info("Slash commands registered");
    } catch (err) {
      logger.error({ err }, "Failed to register slash commands");
    }
  });

  // ─── Slash commands handler ────────────────────────────────────────────────

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    try {
      if (commandName === "setprefix") {
        const prefix = interaction.options.getString("prefix", true);
        db.set(`prefix_${interaction.guildId}`, prefix);
        await interaction.reply({
          content: `✅ تم تغيير بريفكس البوت إلى: \`${prefix}\``,
          ephemeral: true,
        });
        return;
      }

      if (commandName === "autotax") {
        const channel = interaction.options.getChannel("channel", true);
        db.set(`autotax_${interaction.guildId}`, { channelID: channel.id });
        await interaction.reply({
          content: `✅ تم تحديد روم الضرائب التلقائية بنجاح: ${channel.toString()}`,
          ephemeral: true,
        });
        return;
      }

      if (commandName === "setmode") {
        const mode = interaction.options.getString("mode", true);
        db.set(`server_mode_${interaction.guildId}`, mode);
        const label = mode === "shops" ? "سيرفرات الشوب" : "سيرفرات الاستور";
        await interaction.reply({
          content: `✅ تم تعيين نظام النشر إلى **${label}** بنجاح!`,
          ephemeral: true,
        });
        return;
      }

      if (commandName === "setfeedback") {
        const channel = interaction.options.getChannel("channel", true);
        db.set(`feedback_${interaction.guildId}`, { channelID: channel.id });
        await interaction.reply({
          content: `✅ تم تحديد روم الفيدباك بنجاح: ${channel.toString()}`,
          ephemeral: true,
        });
        return;
      }

      if (commandName === "setoffers") {
        const channel = interaction.options.getChannel("channel", true);
        db.set(`offers_${interaction.guildId}`, { channelID: channel.id });
        await interaction.reply({
          content: `✅ تم تحديد روم العروض بنجاح: ${channel.toString()}`,
          ephemeral: true,
        });
        return;
      }

      if (commandName === "setsuggestion") {
        const channel = interaction.options.getChannel("channel", true);
        db.set(`suggestion_${interaction.guildId}`, { channelID: channel.id });
        await interaction.reply({
          content: `✅ تم تحديد روم الاقتراحات بنجاح: ${channel.toString()}`,
          ephemeral: true,
        });
        return;
      }

      if (commandName === "offersinfo") {
        const offerId = interaction.options.getString("id", true);
        const offerData = db.get(`offer_${offerId}`) as {
          msgId: string;
          channelId: string;
          sellerId: string;
          guildId: string;
        } | null;

        if (!offerData) {
          await interaction.reply({
            content: `❌ مفيش عرض بالايدي ده: \`${offerId}\``,
            ephemeral: true,
          });
          return;
        }

        const link = `https://discord.com/channels/${offerData.guildId}/${offerData.channelId}/${offerData.msgId}`;
        const guild = client.guilds.cache.get(offerData.guildId);
        const channel = guild?.channels.cache.get(offerData.channelId);

        const embed = new EmbedBuilder()
          .setTitle(`📦 معلومات العرض: ${offerId}`)
          .addFields(
            { name: "🧾 معرف الرسالة", value: offerData.msgId || "غير متوفر", inline: true },
            {
              name: "💬 القناة",
              value: channel ? `<#${channel.id}>` : offerData.channelId || "غير متوفر",
              inline: true,
            },
            { name: "👤 البائع", value: `<@${offerData.sellerId}>`, inline: true },
            { name: "🏠 السيرفر", value: guild ? guild.name : offerData.guildId || "غير متوفر", inline: true },
            { name: "🔗 رابط الرسالة", value: `[اضغط هنا للانتقال](${link})`, inline: false },
          )
          .setColor("Blue")
          .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
    } catch (err) {
      logger.error({ err }, "Slash command error");
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: "حصل خطأ أثناء تنفيذ الأمر.", ephemeral: true });
      }
    }
  });

  // ─── Button interactions ───────────────────────────────────────────────────

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isButton()) return;

    const { customId } = interaction;

    try {
      // ── Feedback stars ─────────────────────────────────────────────────────
      if (customId.startsWith("star_")) {
        const stars = customId.split("_")[1];
        if (!stars) return;
        const collector = (interaction.message as Message & { _collector?: unknown })._collector;
        if (collector) return;
        return;
      }

      // ── Suggestions ────────────────────────────────────────────────────────
      if (customId.startsWith("suggest_")) {
        const parts = customId.split("_");
        const action = parts[1];
        const userId = parts[2];

        if (!interaction.guild || !interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild)) {
          await interaction.reply({ content: "دور على حد يعطيك صلاحيات يا فقير", ephemeral: true });
          return;
        }

        if (action === "blacklist") {
          const member = await interaction.guild.members.fetch(userId!).catch(() => null);
          const channelData = db.get(`suggestion_${interaction.guild.id}`) as { channelID: string } | null;
          if (!member || !channelData) {
            await interaction.reply({ content: "ماقدرتش ألاقي العضو أو روم الاقتراحات!", ephemeral: true });
            return;
          }
          const ch = interaction.guild.channels.cache.get(channelData.channelID) as TextChannel | undefined;
          if (!ch) {
            await interaction.reply({ content: "روم الاقتراحات مش موجود", ephemeral: true });
            return;
          }
          await ch.permissionOverwrites.edit(member.id, { SendMessages: false, AddReactions: false });
          const newButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(`suggest_unblacklist_${member.id}`)
              .setLabel("Unblacklist")
              .setEmoji("✅")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(`suggest_delete_${member.id}`)
              .setLabel("Delete")
              .setEmoji("🗑️")
              .setStyle(ButtonStyle.Secondary),
          );
          await interaction.message.edit({ components: [newButtons] });
          await interaction.reply({ content: `تم منع <@${member.id}> من إرسال اقتراحات.`, ephemeral: true });
          return;
        }

        if (action === "unblacklist") {
          const member = await interaction.guild.members.fetch(userId!).catch(() => null);
          const data = db.get(`suggestion_${interaction.guild.id}`) as { channelID: string } | null;
          if (!member || !data) {
            await interaction.reply({ content: "ماقدرتش ألاقي العضو أو روم الاقتراحات", ephemeral: true });
            return;
          }
          const ch = interaction.guild.channels.cache.get(data.channelID) as TextChannel | undefined;
          if (!ch) {
            await interaction.reply({ content: "روم الاقتراحات مش موجود", ephemeral: true });
            return;
          }
          await ch.permissionOverwrites.delete(member.id).catch(() => {});
          const newButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(`suggest_blacklist_${member.id}`)
              .setLabel("Blacklist")
              .setEmoji("🚫")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId(`suggest_delete_${member.id}`)
              .setLabel("Delete")
              .setEmoji("🗑️")
              .setStyle(ButtonStyle.Secondary),
          );
          await interaction.message.edit({ components: [newButtons] });
          await interaction.reply({
            content: `تم فك المنع عن <@${member.id}> ويقدر يرسل اقتراحات تاني.`,
            ephemeral: true,
          });
          return;
        }

        if (action === "delete") {
          const thread = interaction.channel?.isThread() ? interaction.channel : null;
          const msg = !thread
            ? interaction.message
            : await interaction.channel?.messages.fetch(interaction.message.id).catch(() => null);
          await msg?.delete().catch(() => {});
          if (thread) await thread.delete().catch(() => {});
          await interaction.reply({ content: "تم حذف الاقتراح", ephemeral: true });
          return;
        }
      }

      // ── Buy button (store mode) ────────────────────────────────────────────
      if (customId.startsWith("buy_")) {
        const parts = customId.split("_");
        const sellerId = parts[1]!;
        const offerId = parts[2]!;
        const offerData = db.get(`offer_${offerId}`) as {
          msgId: string;
          channelId: string;
          sellerId: string;
          guildId: string;
        } | null;
        const buyer = interaction.user;
        const guild = interaction.guild;

        if (!offerData) {
          await interaction.reply({ content: "معرف المنشور دا مش موجود أو اتحذف.", ephemeral: true });
          return;
        }
        if (!guild) return;
        if (!Category) {
          await interaction.reply({ content: "الظاهر كدا ان صاحب السيرفر نسي يحدد الكاتجري", ephemeral: true });
          return;
        }

        const seller = await guild.members.fetch(sellerId).catch(() => null);
        if (!seller) {
          await interaction.reply({ content: "ملقتش البائع ف السيرفر", ephemeral: true });
          return;
        }

        const channel = await guild.channels.create({
          name: `ticket-${buyer.username}`,
          type: ChannelType.GuildText,
          parent: Category,
          permissionOverwrites: [
            { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
            {
              id: buyer.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
              ],
            },
            {
              id: seller.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
              ],
            },
            {
              id: client.user!.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ManageChannels,
              ],
            },
          ],
        });

        await interaction.reply({ content: `✅ تم فتح تذكرتك: ${channel.toString()}`, ephemeral: true });

        const embed = new EmbedBuilder()
          .setTitle("طلب جديد")
          .addFields(
            { name: "المشتري", value: `${buyer}`, inline: true },
            { name: "البائع", value: `${seller}`, inline: true },
            { name: "رقم المنشور", value: `**\`${offerId}\`**`, inline: false },
          )
          .setColor("Green")
          .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`come_${buyer.id}`)
            .setLabel("استدعاء")
            .setEmoji("📩")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("close_ticket")
            .setLabel("اغلاق التذكرة")
            .setEmoji("🔒")
            .setStyle(ButtonStyle.Danger),
        );

        await channel.send({
          content: `مرحبا بك في تذكرتك الخاصة مع البائع ${seller}!\nيرجى مناقشة تفاصيل الشراء هنا.`,
          embeds: [embed],
          components: [row],
        });
        return;
      }

      // ── Come (call buyer via DM) ───────────────────────────────────────────
      if (customId.startsWith("come_")) {
        const buyerId = customId.split("_")[1]!;
        const buyerUser = await client.users.fetch(buyerId).catch(() => null);
        if (!buyerUser) {
          await interaction.reply({ content: "ملقتش المشتري.", ephemeral: true });
          return;
        }
        try {
          await buyerUser.send({
            content: `📩 البائع استدعاك للتذكرة!\nادخل من هنا: ${interaction.channel?.url ?? ""}`,
          });
          await interaction.reply({ content: "✅ تم استدعاء المشتري في الخاص.", ephemeral: true });
        } catch {
          await interaction.reply({
            content: "❌ مقدرتش ابعت للمشتري في الخاص (يمكن قافل الخاص).",
            ephemeral: true,
          });
        }
        return;
      }

      // ── Close ticket ──────────────────────────────────────────────────────
      if (customId === "close_ticket") {
        const confirmRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("confirm_close")
            .setLabel("متاكد؟")
            .setEmoji("✅")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("cancel_close")
            .setLabel("الغاء")
            .setEmoji("❌")
            .setStyle(ButtonStyle.Secondary),
        );
        await interaction.reply({ content: "انت متأكد انك عايز تقفل التذكرة؟", components: [confirmRow], ephemeral: true });
        return;
      }

      if (customId === "confirm_close") {
        await interaction.reply({ content: "⏳ جاري اغلاق التذكرة...", ephemeral: true });
        setTimeout(() => {
          (interaction.channel as TextChannel | null)?.delete().catch(() => {});
        }, 2000);
        return;
      }

      if (customId === "cancel_close") {
        await interaction.reply({ content: "تمام، مش هنقفل التذكرة 👌", ephemeral: true });
        return;
      }
    } catch (err) {
      logger.error({ err }, "Button interaction error");
    }
  });

  // ─── Message events ────────────────────────────────────────────────────────

  // نظام الضريبة التلقائية
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot || !message.guild) return;
    const channelData = db.get(`autotax_${message.guild.id}`) as { channelID: string } | null;
    if (!channelData || message.channel.id !== channelData.channelID) return;

    let input = message.content.trim().toLowerCase();
    let amount: number;
    if (input.endsWith("k")) amount = parseFloat(input) * 1000;
    else if (input.endsWith("m")) amount = parseFloat(input) * 1000000;
    else if (input.endsWith("b")) amount = parseFloat(input) * 1000000000;
    else amount = parseFloat(input);

    if (isNaN(amount) || amount <= 0) {
      await message.reply("❌ اكتب رقم صحيح لحساب الضريبة.").catch(() => {});
      return;
    }

    const tax = amount * 0.05;
    const received = amount - tax;
    const needed = amount / 0.95;
    const fmt = (n: number) => n.toLocaleString();

    await message
      .reply({
        content: `
• :coin: **ضريبة مبلغ ${fmt(amount)}**

• 💳 كم بيسحب منك البوت: \`${tax.toFixed(0)}\` (**${fmt(Math.round(tax))}**)
• 💵 كم بتوصل الى شخص: \`${received.toFixed(0)}\` (**${fmt(Math.round(received))}**)
• 💰 كم لازم تحول عشان يوصل المبلغ بالضبط: \`${needed.toFixed(0)}\` (**${fmt(Math.round(needed))}**)
`,
      })
      .catch(() => {});
  });

  // نظام الفيدباك
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot || !message.guild) return;
    const channelData = db.get(`feedback_${message.guild.id}`) as { channelID: string } | null;
    if (!channelData || message.channel.id !== channelData.channelID) return;
    const feedbackCh = message.channel as TextChannel;

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("star_1").setLabel("⭐").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("star_2").setLabel("⭐⭐").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("star_3").setLabel("⭐⭐⭐").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("star_4").setLabel("⭐⭐⭐⭐").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("star_5").setLabel("⭐⭐⭐⭐⭐").setStyle(ButtonStyle.Secondary),
    );

    const msg = await message.reply({
      content: `💬 **${message.author.username}**, اختر تقييمك لرسالتك:`,
      components: [row],
    });

    const collector = msg.createMessageComponentCollector({ time: 60000 });

    collector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        await btnInteraction.reply({ content: "الزر دا مش بتاعك", ephemeral: true });
        return;
      }
      const stars = btnInteraction.customId.split("_")[1];
      collector.stop();

      await message.delete().catch(() => {});
      await msg.delete().catch(() => {});

      const embed = new EmbedBuilder()
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL({ size: 1024 }),
        })
        .addFields(
          { name: "المستخدم:", value: `${message.author}`, inline: true },
          { name: "التقييم:", value: `${"⭐".repeat(Number(stars))} (\`${stars} نجوم\`)`, inline: true },
          { name: "الرسالة:", value: message.content },
        )
        .setColor("#FFD700")
        .setTimestamp();

      await feedbackCh.send({ embeds: [embed] });
    });

    collector.on("end", async () => {
      await msg.edit({ components: [] }).catch(() => {});
    });
  });

  // نظام الاقتراحات
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot || !message.guild) return;
    const channelData = db.get(`suggestion_${message.guild.id}`) as { channelID: string } | null;
    if (!channelData || message.channel.id !== channelData.channelID) return;
    const suggCh = message.channel as TextChannel;

    await message.delete().catch(() => {});

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL({ size: 1024 }),
      })
      .setDescription(message.content)
      .setColor("Blue")
      .setTimestamp()
      .setFooter({ text: `اقتراحات | ${message.guild.name}` });

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`suggest_blacklist_${message.author.id}`)
        .setLabel("Blacklist")
        .setEmoji("🚫")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`suggest_delete_${message.author.id}`)
        .setLabel("Delete")
        .setEmoji("🗑️")
        .setStyle(ButtonStyle.Secondary),
    );

    const msg = await suggCh.send({ embeds: [embed], components: [buttons] });

    const thread = await msg
      .startThread({ name: message.author.username, reason: "لمناقشة الاقتراح" })
      .catch(() => null);
    if (thread) await thread.send(`شكراً لك على اقتراحك ${message.author}`).catch(() => {});
  });

  // نظام العروض
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot || !message.guild) return;
    const channelData = db.get(`offers_${message.guild.id}`) as { channelID: string } | null;
    if (!channelData || message.channel.id !== channelData.channelID) return;

    const mode = (db.get(`server_mode_${message.guild.id}`) as string | null) ?? "shops";
    const textChannel = message.channel as TextChannel;

    const files: { attachment: Buffer; name: string }[] = [];
    for (const attachment of message.attachments.values()) {
      try {
        const response = await axios.get<ArrayBuffer>(attachment.url, {
          responseType: "arraybuffer",
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
        files.push({ attachment: Buffer.from(response.data), name: attachment.name });
      } catch {}
    }

    await message.delete().catch(() => {});

    let webhooks = await textChannel.fetchWebhooks();
    let webhook = webhooks.find((wh) => wh.name === "Offers Webhook") ?? null;
    if (!webhook) {
      webhook = await textChannel.createWebhook({
        name: "Offers Webhook",
        avatar: message.guild.iconURL({ size: 512 }) ?? undefined,
      });
    }

    const offerId = Math.floor(100000 + Math.random() * 900000).toString();
    const rolesMention = OffersRoles.map((id) => `<@&${id}>`).join(" ");
    const content = `${message.content || ""}\n\n-# رقم المنشور: **\`${offerId}\`**\n-# منشور من قبل: ${message.author}\n-# ${rolesMention}`;
    const member = message.member as GuildMember;

    if (mode === "shops") {
      const msg = await webhook.send({
        username: member.displayName,
        avatarURL: message.author.displayAvatarURL({ size: 256 }),
        content,
        files,
      });
      db.set(`offer_${offerId}`, {
        msgId: msg.id,
        channelId: message.channel.id,
        sellerId: message.author.id,
        guildId: message.guild.id,
      });
    } else if (mode === "store") {
      const buyRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`buy_${message.author.id}_${offerId}`)
          .setLabel("طلب")
          .setEmoji("🛒")
          .setStyle(ButtonStyle.Secondary),
      );

      const msg = await webhook.send({
        username: member.displayName,
        avatarURL: message.author.displayAvatarURL({ size: 256 }),
        content,
        files,
        components: [buyRow],
      });
      db.set(`offer_${offerId}`, {
        msgId: msg.id,
        channelId: message.channel.id,
        sellerId: message.author.id,
        guildId: message.guild.id,
      });
    }
  });

  // نظام الردود التلقائية للبائعين
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot || !message.guild || !message.member) return;
    const hasSeller = message.member.roles.cache.some((r) => Sellers.includes(r.id));
    if (!hasSeller) return;

    const replies: Record<string, string> = {
      برمجه: MESSAGES.Programming,
      تحويل: MESSAGES.transformation,
      تقييم: MESSAGES.evaluation,
      خمول: MESSAGES.Lethargy,
      تصاميم: MESSAGES.Designs,
    };

    const reply = replies[message.content];
    if (reply) await (message.channel as TextChannel).send(reply).catch(() => {});
  });

  // ─── Prefix commands ──────────────────────────────────────────────────────

  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot || !message.guild || !message.member) return;
    const prefix = (db.get(`prefix_${message.guild.id}`) as string | null) ?? "!";
    const content = message.content;
    const ch = message.channel as TextChannel;

    // ping
    if (content === `${prefix}ping`) {
      const sent = await ch.send("1.2.3");
      await sent.edit(`بونج 🏓! الوقت المستغرق: \`${sent.createdTimestamp - message.createdTimestamp}ms\`.`);
      return;
    }

    // serverinfo
    if (content === `${prefix}serverinfo`) {
      const { guild } = message;
      const owner = await guild.fetchOwner();
      const embed = new EmbedBuilder()
        .setAuthor({ name: `📊 Server Info`, iconURL: guild.iconURL({ size: 256 }) ?? undefined })
        .setTitle(`✨ ${guild.name}`)
        .setThumbnail(guild.iconURL({ size: 1024 }) ?? null)
        .setDescription(`> 🏰 **معلومات السيرفر العامة**`)
        .addFields(
          { name: "🆔 معرف السيرفر", value: `\`${guild.id}\``, inline: true },
          { name: "👑 المالك", value: `${owner.user.tag}`, inline: true },
          { name: "🧩 عدد الرولات", value: `${guild.roles.cache.size}`, inline: true },
          { name: "👥 عدد الاعضاء", value: `${guild.memberCount}`, inline: true },
          { name: "💬 عدد الرومات", value: `${guild.channels.cache.size}`, inline: true },
          {
            name: "📢 عدد الرومات الصوتية",
            value: `${guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size}`,
            inline: true,
          },
          { name: "🛡️ مستوى التحقق", value: `${guild.verificationLevel}`, inline: true },
          {
            name: "📅 انشاء السيرفر",
            value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
            inline: false,
          },
        )
        .setFooter({
          text: `Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({ size: 256 }),
        })
        .setColor("Blurple")
        .setTimestamp();
      await ch.send({ embeds: [embed] });
      return;
    }

    // userinfo
    if (content.startsWith(`${prefix}userinfo`)) {
      const args = content.split(" ").slice(1);
      const member =
        message.mentions.members?.first() ??
        (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : message.member);

      if (!member) {
        await message.reply("⚠️ العضو مش موجود أو الآيدي غلط.");
        return;
      }
      const user = member.user;
      const embed = new EmbedBuilder()
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ size: 256 }) })
        .setThumbnail(user.displayAvatarURL({ size: 1024 }))
        .setColor("#00BFFF")
        .addFields(
          { name: "🆔 الآيدي", value: user.id, inline: true },
          { name: "👤 الاسم", value: user.username, inline: true },
          {
            name: "📆 أنشأ حسابه في",
            value: `<t:${Math.floor(user.createdTimestamp / 1000)}:f>`,
            inline: false,
          },
          {
            name: "🚪 دخل السيرفر في",
            value: member.joinedTimestamp
              ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>`
              : "غير معروف",
            inline: false,
          },
          {
            name: "🏷️ الرتب",
            value:
              member.roles.cache.filter((r) => r.id !== message.guild!.id).size > 0
                ? member.roles.cache
                    .filter((r) => r.id !== message.guild!.id)
                    .map((r) => r.toString())
                    .join(", ")
                : "لا يمتلك أي رتبة",
            inline: false,
          },
        )
        .setFooter({
          text: `طلب بواسطة ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({ size: 256 }),
        })
        .setTimestamp();
      await message.reply({ embeds: [embed] });
      return;
    }

    // lock
    if (content === `${prefix}lock`) {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        await message.reply("❌ انت مش معاك صلاحية `Manage Channels` عشان تستخدم الامر دا.");
        return;
      }
      await ch.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
      await ch.send("🔒 تم قفل الروم بنجاح.");
      return;
    }

    // unlock
    if (content === `${prefix}unlock`) {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        await message.reply("❌ انت مش معاك صلاحية `Manage Channels` عشان تستخدم الامر دا.");
        return;
      }
      await ch.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: true });
      await ch.send("🔓 تم فتح الروم بنجاح.");
      return;
    }

    // hide
    if (content === `${prefix}hide`) {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        await message.reply("❌ انت مش معاك صلاحية `Manage Channels` عشان تستخدم الامر دا.");
        return;
      }
      await ch.permissionOverwrites.edit(message.guild.roles.everyone, { ViewChannel: false });
      await ch.send("🙈 تم اخفاء الروم بنجاح.");
      return;
    }

    // show
    if (content === `${prefix}show`) {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        await message.reply("❌ انت مش معاك صلاحية `Manage Channels` عشان تستخدم الامر دا.");
        return;
      }
      await ch.permissionOverwrites.edit(message.guild.roles.everyone, { ViewChannel: true });
      await ch.send("🐵 تم اظهار الروم بنجاح.");
      return;
    }

    // timeout
    if (content.startsWith(`${prefix}timeout`)) {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        await message.reply("❌ مش معاك صلاحية تعمل تايم أوت.");
        return;
      }
      const args = content.split(" ").slice(1);
      const target =
        message.mentions.members?.first() ??
        (args[0] ? message.guild.members.cache.get(args[0]) : undefined);
      const time = args[1];
      const reason = args.slice(2).join(" ") || "بدون سبب";
      if (!target) {
        await message.reply("⚠️ لازم تعمل منشن لعضو أو تكتب آيديه.");
        return;
      }
      if (!time) {
        await message.reply("⌛ حدد المدة (مثلاً: `10m`, `1h`, `2d`).");
        return;
      }
      const duration = ms(time);
      if (!duration || isNaN(duration)) {
        await message.reply("❌ المدة غير صحيحة.");
        return;
      }
      if (duration > 28 * 24 * 60 * 60 * 1000) {
        await message.reply("❌ أقصى مدة تايم أوت هي 28 يوم.");
        return;
      }
      try {
        await target.timeout(duration, reason);
        await message.reply(
          `✅ تم عمل تايم أوت لـ ${target.user.tag} لمدة **${time}**.\n📄 السبب: ${reason}`,
        );
      } catch (err) {
        logger.error({ err }, "timeout error");
      }
      return;
    }

    // untimeout
    if (content.startsWith(`${prefix}untimeout`)) {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        await message.reply("❌ مش معاك صلاحية فك التايم أوت يا نجم.");
        return;
      }
      const args = content.split(" ").slice(1);
      const target =
        message.mentions.members?.first() ??
        (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);
      const reason = args.slice(1).join(" ") || "بدون سبب";
      if (!target) {
        await message.reply("⚠️ لازم تعمل منشن أو تكتب آيدي الشخص.");
        return;
      }
      if (!target.communicationDisabledUntilTimestamp) {
        await message.reply("ℹ️ الشخص دا مش عليه تايم أوت أصلاً.");
        return;
      }
      try {
        await target.timeout(null, reason);
        await message.reply(`✅ تم فك التايم أوت عن ${target.user.tag}.\n📄 السبب: ${reason}`);
      } catch (err) {
        logger.error({ err }, "untimeout error");
        await message.reply("⚠️ حصل خطأ أثناء فك التايم أوت، تأكد إن البوت عنده صلاحية.");
      }
      return;
    }

    // ban
    if (content.startsWith(`${prefix}ban`)) {
      if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        await message.reply("❌ مش معاك صلاحية بان يا نجم.");
        return;
      }
      const args = content.split(" ").slice(1);
      const target =
        message.mentions.members?.first() ??
        (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);
      const reason = args.slice(1).join(" ") || "بدون سبب";
      if (!target) {
        await message.reply("⚠️ لازم تعمل منشن أو تكتب آيدي الشخص اللي عايز تعمله بان.");
        return;
      }
      if (!target.bannable) {
        await message.reply("🚫 مش قادر أعمل بان للشخص دا، يمكن رتبته أعلى من البوت أو عنده صلاحيات.");
        return;
      }
      try {
        await target.ban({ reason });
        await message.reply(`✅ تم حظر ${target.user.tag} من السيرفر.\n📄 السبب: ${reason}`);
      } catch (err) {
        logger.error({ err }, "ban error");
      }
      return;
    }

    // unban
    if (content.startsWith(`${prefix}unban`)) {
      if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        await message.reply("❌ مش معاك صلاحية فك البان يا نجم.");
        return;
      }
      const args = content.split(" ").slice(1);
      const userId = args[0];
      const reason = args.slice(1).join(" ") || "بدون سبب";
      if (!userId) {
        await message.reply("⚠️ لازم تكتب آيدي الشخص اللي عايز تفك عنه البان.");
        return;
      }
      try {
        const bannedUsers = await message.guild.bans.fetch();
        const user = bannedUsers.get(userId);
        if (!user) {
          await message.reply("❌ الشخص دا مش متبند أصلاً.");
          return;
        }
        await message.guild.members.unban(userId, reason);
        await message.reply(`✅ تم فك البان عن ${user.user.tag}.\n📄 السبب: ${reason}`);
      } catch (err) {
        logger.error({ err }, "unban error");
      }
      return;
    }

    // unbanall
    if (content === `${prefix}unbanall`) {
      if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        await message.reply("❌ مش معاك صلاحية فك البان يا نجم.");
        return;
      }
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("confirm_unbanall")
          .setLabel("✅ فك البان عن الكل")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("cancel_unbanall")
          .setLabel("❌ إلغاء")
          .setStyle(ButtonStyle.Secondary),
      );
      const msg = await message.reply({
        content: "⚠️ هل انت متأكد إنك عايز تفك البان عن **كل الناس** المتبنده في السيرفر؟",
        components: [row],
      });
      const filter = (i: { user: { id: string } }) => i.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({ filter, time: 15000 });
      collector.on("collect", async (btnInteraction) => {
        if (btnInteraction.customId === "confirm_unbanall") {
          await btnInteraction.deferReply({ ephemeral: true });
          try {
            const bans = await message.guild!.bans.fetch();
            if (bans.size === 0) {
              await btnInteraction.editReply("✅ مفيش أي حد متبند.");
              await msg.delete().catch(() => {});
              return;
            }
            let count = 0;
            for (const ban of bans.values()) {
              await message.guild!.members.unban(ban.user.id, "Unban All Command");
              count++;
            }
            await btnInteraction.editReply(`✅ تم فك البان عن **${count}** شخص.`);
            await msg.delete().catch(() => {});
          } catch (err) {
            logger.error({ err }, "unbanall error");
            await btnInteraction.editReply("⚠️ حصل خطأ أثناء فك البان عن الكل.");
          }
        } else if (btnInteraction.customId === "cancel_unbanall") {
          await btnInteraction.reply({ content: "❌ تم إلغاء العملية.", ephemeral: true });
          await msg.delete().catch(() => {});
        }
      });
      collector.on("end", async () => {
        await msg.edit({ components: [] }).catch(() => {});
      });
      return;
    }

    // giverole
    if (content.startsWith(`${prefix}giverole`)) {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        await message.reply("❌ مش معاك صلاحية إدارة الرتب يا نجم.");
        return;
      }
      const args = content.split(" ").slice(1);
      const target =
        message.mentions.members?.first() ??
        (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);
      const role =
        message.mentions.roles.first() ??
        (args[1] ? message.guild.roles.cache.get(args[1]) : undefined);

      if (!target) {
        await message.reply("⚠️ لازم تعمل منشن أو تكتب آيدي الشخص.");
        return;
      }
      if (!role) {
        await message.reply("⚠️ لازم تعمل منشن أو تكتب آيدي الرول اللي عايز تديه.");
        return;
      }
      const me = message.guild.members.me;
      if (me && role.position >= me.roles.highest.position) {
        await message.reply("🚫 الرول دا أعلى من أعلى رول عندي، مش هقدر أديه.");
        return;
      }
      try {
        await target.roles.add(role);
        await message.reply(`✅ تم إعطاء الرتبة ${role.name} لـ ${target.user.tag}`);
      } catch (err) {
        logger.error({ err }, "giverole error");
        await message.reply("⚠️ حصل خطأ أثناء محاولة إعطاء الرتبة.");
      }
      return;
    }

    // removerole
    if (content.startsWith(`${prefix}removerole`)) {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        await message.reply("❌ مش معاك صلاحية إدارة الرتب يا نجم.");
        return;
      }
      const args = content.split(" ").slice(1);
      const target =
        message.mentions.members?.first() ??
        (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);
      const role =
        message.mentions.roles.first() ??
        (args[1] ? message.guild.roles.cache.get(args[1]) : undefined);

      if (!target) {
        await message.reply("⚠️ لازم تعمل منشن أو تكتب آيدي العضو.");
        return;
      }
      if (!role) {
        await message.reply("⚠️ لازم تعمل منشن أو تكتب آيدي الرتبة اللي عايز تشيلها.");
        return;
      }
      if (!target.roles.cache.has(role.id)) {
        await message.reply("ℹ️ العضو دا مش عنده الرتبة دي أصلاً.");
        return;
      }
      const me = message.guild.members.me;
      if (me && role.position >= me.roles.highest.position) {
        await message.reply("🚫 الرول دي أعلى من أعلى رول عندي، مش هقدر أشيلها.");
        return;
      }
      try {
        await target.roles.remove(role);
        await message.reply(`✅ تم إزالة الرتبة ${role.name} من ${target.user.tag}`);
      } catch (err) {
        logger.error({ err }, "removerole error");
        await message.reply("⚠️ حصل خطأ أثناء إزالة الرتبة.");
      }
      return;
    }

    // help
    if (content === `${prefix}help`) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${message.guild.name} Commands List`,
          iconURL: message.guild.iconURL({ size: 256 }) ?? undefined,
        })
        .setTitle("📜 قائمة أوامر البوت")
        .setDescription(`> استخدم \`${prefix}\` قبل كل أمر\n> مثال: \`${prefix}ping\`\n\n`)
        .addFields(
          {
            name: "> ⚙️ أوامر عامة",
            value: `
• \`${prefix}ping\` → اختبار سرعة استجابة البوت
• \`${prefix}serverinfo\` → عرض معلومات السيرفر
• \`${prefix}userinfo [@user|userID]\` → عرض معلومات عن عضو
            `,
            inline: false,
          },
          {
            name: "> 🔒 أوامر الإدارة",
            value: `
• \`${prefix}lock\` → قفل الروم الحالي
• \`${prefix}unlock\` → فتح الروم الحالي
• \`${prefix}hide\` → إخفاء الروم الحالي
• \`${prefix}show\` → إظهار الروم الحالي
            `,
            inline: false,
          },
          {
            name: "> 🛠️ أوامر العقوبات",
            value: `
• \`${prefix}timeout <@user> <time> [reason]\` → عمل تايم أوت لعضو
• \`${prefix}untimeout <@user> [reason]\` → فك التايم أوت
• \`${prefix}ban <@user> [reason]\` → حظر عضو
• \`${prefix}unban <userID> [reason]\` → فك الحظر
• \`${prefix}unbanall\` → فك الحظر عن كل الأعضاء
            `,
            inline: false,
          },
          {
            name: "> 🎭 أوامر الرتب",
            value: `
• \`${prefix}giverole <@user> <@role>\` → إعطاء رتبة لعضو
• \`${prefix}removerole <@user> <@role>\` → إزالة رتبة من عضو
            `,
            inline: false,
          },
          {
            name: "> 🎫 أوامر التذاكر",
            value: `
• افتح تذكرة عن طريق زر الشراء في منشورات العروض
• \`برمجه\` - للحصول على معلومات عن البرمجة
• \`تحويل\` - للحصول على معلومات عن التحويل
• \`تقييم\` - للحصول على معلومات عن التقييم
• \`خمول\` - للحصول على معلومات عن الخمول
• \`تصاميم\` - للحصول على معلومات عن التصاميم
            `,
            inline: false,
          },
        )
        .setColor("Blurple")
        .setThumbnail(client.user?.displayAvatarURL({ size: 256 }) ?? null)
        .setFooter({
          text: `Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({ size: 256 }),
        })
        .setTimestamp();

      await ch.send({ embeds: [embed] });
      return;
    }
  });

  // ─── Login ────────────────────────────────────────────────────────────────

  client.login(token).catch((err: unknown) => {
    logger.error({ err }, "Failed to login Discord bot");
    setStatus({ connected: false, error: String(err) });
  });

  client.on("error", (err) => {
    logger.error({ err }, "Discord client error");
    setStatus({ connected: false, error: String(err) });
  });
}

// Suppress unused Collection import warning
const _col = Collection;
void _col;
