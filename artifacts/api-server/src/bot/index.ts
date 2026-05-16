import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits,
  ChannelType,
  OverwriteType,
  type Interaction,
  type ChatInputCommandInteraction,
  type ButtonInteraction,
  type MessageComponentInteraction,
  type ModalSubmitInteraction,
  type TextChannel,
  type Guild,
} from "discord.js";
import { logger } from "../lib/logger";
import { loadConfig, saveConfig } from "./config";
import { setStatus } from "./status";

const BANK_DATA = {
  rajhi: {
    label: "الراجحي",
    iban: "SA66 8000 0386 6080 1607 8150",
    name: "عمر العنزي",
    bank: "بنك الراجحي",
    color: 0x006400,
  },
  alinma: {
    label: "الإنماء",
    iban: "SA1205000068207423526001",
    name: "خالد المطيري",
    bank: "بنك الإنماء",
    color: 0x0055a5,
  },
  yourpay: {
    label: "يور باي",
    iban: "SA7780207092580222121019",
    name: "خالد المطيري",
    bank: "يور باي",
    color: 0x7c3aed,
  },
} as const;

type BankKey = keyof typeof BANK_DATA;

// ─── Create private ticket channel ───────────────────────────────────────────

async function createTicketChannel(
  guild: Guild,
  userId: string,
  prefix: string,
  adminRoleId: string | null,
): Promise<TextChannel> {
  const member = await guild.members.fetch(userId);
  const username = member.user.username;

  const permissionOverwrites = [
    // Hide from everyone
    {
      id: guild.roles.everyone.id,
      type: OverwriteType.Role,
      deny: [PermissionFlagsBits.ViewChannel],
    },
    // Allow the ticket opener
    {
      id: userId,
      type: OverwriteType.Member,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ],
    },
  ];

  // Allow the admin role if set
  if (adminRoleId) {
    permissionOverwrites.push({
      id: adminRoleId,
      type: OverwriteType.Role,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.ManageChannels,
      ],
    });
  }

  const channel = await guild.channels.create({
    name: `${prefix}-${username}`,
    type: ChannelType.GuildText,
    permissionOverwrites,
    topic: `تذكرة خاصة بـ ${member.user.tag}`,
  });

  return channel as TextChannel;
}

// ─── Button rows ──────────────────────────────────────────────────────────────

function buildPaymentRow(): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("pay_rajhi")
      .setLabel("الراجحي")
      .setEmoji("🏦")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("pay_alinma")
      .setLabel("الإنماء")
      .setEmoji("🏦")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("pay_yourpay")
      .setLabel("يور باي")
      .setEmoji("💳")
      .setStyle(ButtonStyle.Secondary),
  );
}

function buildAdminRow(disabled = false): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("ticket_claim")
      .setLabel("استلام")
      .setEmoji("✅")
      .setStyle(ButtonStyle.Success)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId("ticket_close")
      .setLabel("إغلاق")
      .setEmoji("🔒")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(disabled),
  );
}

function buildPanelRow(): ActionRowBuilder<StringSelectMenuBuilder> {
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("ticket_menu")
      .setPlaceholder("🎫 اختر نوع طلبك...")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("شراء منتج")
          .setDescription("لشراء أي منتج من منتجاتنا")
          .setEmoji("🛒")
          .setValue("open_buy"),
        new StringSelectMenuOptionBuilder()
          .setLabel("استفسار")
          .setDescription("لأي سؤال أو استفسار عام")
          .setEmoji("❓")
          .setValue("open_inquiry"),
        new StringSelectMenuOptionBuilder()
          .setLabel("طلب شراكة")
          .setDescription("للتواصل بشأن الشراكات التجارية")
          .setEmoji("🤝")
          .setValue("open_partnership"),
      ),
  );
}

// ─── Embeds ───────────────────────────────────────────────────────────────────

function buildPanelEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xf59e0b)
    .setTitle("🎫 نظام التذاكر")
    .setDescription("مرحباً بك! اختر نوع طلبك من الأزرار أدناه وسيتم فتح قناة خاصة بك.")
    .addFields(
      { name: "🛒 شراء منتج", value: "لشراء أي منتج من منتجاتنا", inline: true },
      { name: "❓ استفسار", value: "لأي سؤال أو استفسار عام", inline: true },
      { name: "🤝 طلب شراكة", value: "للتواصل بشأن الشراكات التجارية", inline: true },
    )
    .setFooter({ text: "سيتم الرد عليك في أقرب وقت ممكن" })
    .setTimestamp();
}

function buildOrderEmbed(product: string, price: string, userId: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xf59e0b)
    .setTitle("🛒 طلب شراء جديد")
    .addFields(
      { name: "📦 المنتج", value: product, inline: true },
      { name: "💰 السعر", value: `${price} ريال`, inline: true },
      { name: "👤 العضو", value: `<@${userId}>`, inline: true },
    )
    .setDescription(
      "اختر طريقة الدفع المناسبة من الأزرار أدناه.\nسيتم إرسال تفاصيل التحويل إليك بشكل خاص.",
    )
    .setFooter({ text: "بعد التحويل، أرسل إيصال الدفع في هذه القناة" })
    .setTimestamp();
}

function buildInquiryEmbed(subject: string, userId: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x3b82f6)
    .setTitle("❓ استفسار جديد")
    .addFields(
      { name: "📋 الموضوع", value: subject },
      { name: "👤 العضو", value: `<@${userId}>` },
    )
    .setDescription("سيقوم فريق الدعم بالرد عليك قريباً.")
    .setTimestamp();
}

function buildPartnershipEmbed(details: string, userId: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x8b5cf6)
    .setTitle("🤝 طلب شراكة جديد")
    .addFields(
      { name: "📝 التفاصيل", value: details },
      { name: "👤 مقدم الطلب", value: `<@${userId}>` },
    )
    .setDescription("سيتم مراجعة طلبك والتواصل معك في أقرب وقت.")
    .setTimestamp();
}

// ─── Bank button handler ──────────────────────────────────────────────────────

async function handleBankButton(
  interaction: ButtonInteraction,
  bankKey: BankKey,
): Promise<void> {
  const bank = BANK_DATA[bankKey];
  const embed = new EmbedBuilder()
    .setTitle(`🏦 ${bank.label} — تفاصيل التحويل`)
    .setColor(bank.color)
    .addFields(
      { name: "🏦 البنك", value: bank.bank },
      { name: "👤 الاسم", value: bank.name },
      { name: "💳 رقم الآيبان", value: `\`\`\`${bank.iban}\`\`\`` },
    )
    .setDescription("حوّل المبلغ المطلوب ثم أرسل إيصال الدفع في هذه القناة.")
    .setFooter({ text: "🔒 هذه الرسالة مرئية لك فقط" });
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

// ─── Claim / Close handlers ───────────────────────────────────────────────────

async function handleClaimButton(interaction: ButtonInteraction): Promise<void> {
  const msg = interaction.message;
  const embed = msg.embeds[0];
  if (!embed) return;

  const updatedEmbed = EmbedBuilder.from(embed)
    .setColor(0x22c55e)
    .setDescription(`✅ تم الاستلام بواسطة <@${interaction.user.id}>`);

  const hasPayment = msg.components.length > 1;
  await msg.edit({
    embeds: [updatedEmbed],
    components: hasPayment ? [buildPaymentRow(), buildAdminRow()] : [buildAdminRow()],
  });
  await interaction.reply({ content: `✅ <@${interaction.user.id}> استلم هذه التذكرة.` });
}

async function handleCloseButton(interaction: ButtonInteraction): Promise<void> {
  const msg = interaction.message;
  const embed = msg.embeds[0];
  if (!embed) return;

  const closedEmbed = EmbedBuilder.from(embed)
    .setColor(0x6b7280)
    .setTitle("🔒 تذكرة مغلقة")
    .setDescription(`تم الإغلاق بواسطة <@${interaction.user.id}>`)
    .setFooter(null);

  const hasPayment = msg.components.length > 1;
  await msg.edit({
    embeds: [closedEmbed],
    components: hasPayment ? [buildPaymentRow(), buildAdminRow(true)] : [buildAdminRow(true)],
  });

  await interaction.reply({
    content: `🔒 تم إغلاق التذكرة بواسطة <@${interaction.user.id}>.\nسيتم حذف هذه القناة بعد **5 ثوانٍ**.`,
  });

  // Delete channel after 5 seconds
  const channel = interaction.channel as TextChannel | null;
  if (channel) {
    setTimeout(() => {
      channel.delete(`تذكرة مغلقة بواسطة ${interaction.user.tag}`).catch(() => null);
    }, 5000);
  }
}

// ─── Panel button → show modal ────────────────────────────────────────────────

async function handleOpenBuyModal(interaction: MessageComponentInteraction): Promise<void> {
  const modal = new ModalBuilder().setCustomId("modal_buy").setTitle("🛒 طلب شراء منتج");
  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId("buy_product")
        .setLabel("اسم المنتج")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("مثال: آيفون 15 برو")
        .setRequired(true),
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId("buy_price")
        .setLabel("السعر بالريال")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("مثال: 4500")
        .setRequired(true),
    ),
  );
  await interaction.showModal(modal);
}

async function handleOpenInquiryModal(interaction: MessageComponentInteraction): Promise<void> {
  const modal = new ModalBuilder().setCustomId("modal_inquiry").setTitle("❓ استفسار");
  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId("inquiry_subject")
        .setLabel("موضوع الاستفسار")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("اكتب استفسارك هنا...")
        .setRequired(true),
    ),
  );
  await interaction.showModal(modal);
}

async function handleOpenPartnershipModal(interaction: MessageComponentInteraction): Promise<void> {
  const modal = new ModalBuilder().setCustomId("modal_partnership").setTitle("🤝 طلب شراكة");
  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId("partnership_details")
        .setLabel("تفاصيل طلب الشراكة")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("اذكر تفاصيل مقترح الشراكة...")
        .setRequired(true),
    ),
  );
  await interaction.showModal(modal);
}

// ─── Modal submit → create ticket channel ────────────────────────────────────

async function handleBuyModalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
  const product = interaction.fields.getTextInputValue("buy_product");
  const price = interaction.fields.getTextInputValue("buy_price");
  const config = loadConfig();

  if (!interaction.guild) {
    await interaction.reply({ content: "❌ يجب استخدام هذا الأمر داخل السيرفر.", ephemeral: true });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  const ticketChannel = await createTicketChannel(
    interaction.guild,
    interaction.user.id,
    "شراء",
    config.adminRoleId,
  );

  const embed = buildOrderEmbed(product, price, interaction.user.id);
  const roleMention = config.adminRoleId ? `<@&${config.adminRoleId}>` : "";
  const content = [
    `📬 تذكرة شراء جديدة من <@${interaction.user.id}>`,
    roleMention ? `🔔 ${roleMention}` : "",
  ]
    .filter(Boolean)
    .join("  |  ");

  await ticketChannel.send({
    content,
    embeds: [embed],
    components: [buildPaymentRow(), buildAdminRow()],
    allowedMentions: {
      users: [interaction.user.id],
      roles: config.adminRoleId ? [config.adminRoleId] : [],
    },
  });

  await interaction.editReply({ content: `✅ تم فتح تذكرتك: ${ticketChannel.toString()}` });
}

async function handleInquiryModalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
  const subject = interaction.fields.getTextInputValue("inquiry_subject");
  const config = loadConfig();

  if (!interaction.guild) {
    await interaction.reply({ content: "❌ يجب استخدام هذا الأمر داخل السيرفر.", ephemeral: true });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  const ticketChannel = await createTicketChannel(
    interaction.guild,
    interaction.user.id,
    "استفسار",
    config.adminRoleId,
  );

  const embed = buildInquiryEmbed(subject, interaction.user.id);
  const roleMention = config.adminRoleId ? `<@&${config.adminRoleId}>` : "";
  const content = [
    `📬 استفسار جديد من <@${interaction.user.id}>`,
    roleMention ? `🔔 ${roleMention}` : "",
  ]
    .filter(Boolean)
    .join("  |  ");

  await ticketChannel.send({
    content,
    embeds: [embed],
    components: [buildAdminRow()],
    allowedMentions: {
      users: [interaction.user.id],
      roles: config.adminRoleId ? [config.adminRoleId] : [],
    },
  });

  await interaction.editReply({ content: `✅ تم فتح استفسارك: ${ticketChannel.toString()}` });
}

async function handlePartnershipModalSubmit(
  interaction: ModalSubmitInteraction,
): Promise<void> {
  const details = interaction.fields.getTextInputValue("partnership_details");
  const config = loadConfig();

  if (!interaction.guild) {
    await interaction.reply({ content: "❌ يجب استخدام هذا الأمر داخل السيرفر.", ephemeral: true });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  const ticketChannel = await createTicketChannel(
    interaction.guild,
    interaction.user.id,
    "شراكة",
    config.adminRoleId,
  );

  const embed = buildPartnershipEmbed(details, interaction.user.id);
  const roleMention = config.adminRoleId ? `<@&${config.adminRoleId}>` : "";
  const content = [
    `📬 طلب شراكة من <@${interaction.user.id}>`,
    roleMention ? `🔔 ${roleMention}` : "",
  ]
    .filter(Boolean)
    .join("  |  ");

  await ticketChannel.send({
    content,
    embeds: [embed],
    components: [buildAdminRow()],
    allowedMentions: {
      users: [interaction.user.id],
      roles: config.adminRoleId ? [config.adminRoleId] : [],
    },
  });

  await interaction.editReply({ content: `✅ تم فتح طلب الشراكة: ${ticketChannel.toString()}` });
}

// ─── Slash command handlers ───────────────────────────────────────────────────

async function handleTicketPanelCommand(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  if (
    !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) &&
    !interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)
  ) {
    await interaction.reply({
      content: "❌ تحتاج صلاحية **Administrator** أو **Manage Server**.",
      ephemeral: true,
    });
    return;
  }

  await interaction.reply({ content: "✅ تم إرسال البانل.", ephemeral: true });
  const panelChannel = interaction.channel as TextChannel | null;
  await panelChannel?.send({
    embeds: [buildPanelEmbed()],
    components: [buildPanelRow()],
  });
}

async function handleSetupCommand(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  if (
    !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) &&
    !interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)
  ) {
    await interaction.reply({
      content: "❌ تحتاج صلاحية **Administrator** أو **Manage Server**.",
      ephemeral: true,
    });
    return;
  }

  const role = interaction.options.getRole("role", true);
  const config = loadConfig();
  config.adminRoleId = role.id;
  saveConfig(config);

  await interaction.reply({
    content: `✅ تم ضبط رتبة الإدارة على ${role.toString()}.\nستُذكر عند فتح كل تذكرة.`,
    ephemeral: true,
  });
}

// ─── Bot startup ──────────────────────────────────────────────────────────────

export async function startBot(): Promise<void> {
  const token = process.env["DISCORD_BOT_TOKEN"];

  if (!token) {
    logger.info("DISCORD_BOT_TOKEN not set — bot disabled");
    setStatus({ enabled: false, connected: false, error: "No token provided" });
    return;
  }

  setStatus({ enabled: true });

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  const commands = [
    new SlashCommandBuilder()
      .setName("ticket-panel")
      .setDescription("أرسل بانل التذاكر في هذه القناة")
      .toJSON(),
    new SlashCommandBuilder()
      .setName("setup")
      .setDescription("ضبط رتبة الإدارة التي ستُذكر عند فتح التذاكر")
      .addRoleOption((opt) =>
        opt.setName("role").setDescription("رتبة الإدارة").setRequired(true),
      )
      .toJSON(),
  ];

  client.once("clientReady", async (c) => {
    logger.info({ tag: c.user.tag }, "Discord bot is ready");
    setStatus({ connected: true, tag: c.user.tag, error: null });

    const rest = new REST({ version: "10" }).setToken(token);
    try {
      await rest.put(Routes.applicationCommands(c.user.id), { body: commands });
      logger.info("Slash commands registered (ticket-panel, setup)");
    } catch (err) {
      logger.error({ err }, "Failed to register slash commands");
    }
  });

  client.on("interactionCreate", async (interaction: Interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        if (interaction.commandName === "ticket-panel") await handleTicketPanelCommand(interaction);
        else if (interaction.commandName === "setup") await handleSetupCommand(interaction);
        return;
      }

      if (interaction.isStringSelectMenu() && interaction.customId === "ticket_menu") {
        const value = interaction.values[0];
        if (value === "open_buy") await handleOpenBuyModal(interaction);
        else if (value === "open_inquiry") await handleOpenInquiryModal(interaction);
        else if (value === "open_partnership") await handleOpenPartnershipModal(interaction);
        return;
      }

      if (interaction.isButton()) {
        const id = interaction.customId;
        if (id === "pay_rajhi") await handleBankButton(interaction, "rajhi");
        else if (id === "pay_alinma") await handleBankButton(interaction, "alinma");
        else if (id === "pay_yourpay") await handleBankButton(interaction, "yourpay");
        else if (id === "ticket_claim") await handleClaimButton(interaction);
        else if (id === "ticket_close") await handleCloseButton(interaction);
        return;
      }

      if (interaction.isModalSubmit()) {
        const id = interaction.customId;
        if (id === "modal_buy") await handleBuyModalSubmit(interaction);
        else if (id === "modal_inquiry") await handleInquiryModalSubmit(interaction);
        else if (id === "modal_partnership") await handlePartnershipModalSubmit(interaction);
      }
    } catch (err) {
      logger.error({ err }, "Error handling interaction");
    }
  });

  client.on("error", (err) => {
    logger.error({ err }, "Discord client error");
    setStatus({ connected: false, error: String(err) });
  });

  try {
    await client.login(token);
  } catch (err) {
    logger.error({ err }, "Failed to login to Discord");
    setStatus({ connected: false, error: String(err) });
  }
}
