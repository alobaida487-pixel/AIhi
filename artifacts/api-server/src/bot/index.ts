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
  PermissionFlagsBits,
  type Interaction,
  type ChatInputCommandInteraction,
  type ButtonInteraction,
  TextChannel,
} from "discord.js";
import { logger } from "../lib/logger";
import { loadConfig, saveConfig } from "./config";

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

function buildOrderEmbed(
  product: string,
  price: string,
  userId: string,
  claimedBy?: string,
  closed = false,
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(closed ? 0x6b7280 : claimedBy ? 0x22c55e : 0xf59e0b)
    .setTitle(closed ? "🔒 تذكرة مغلقة" : "🛒 طلب شراء جديد")
    .addFields(
      { name: "📦 المنتج", value: product, inline: true },
      { name: "💰 السعر", value: `${price} ريال`, inline: true },
      { name: "👤 العضو", value: `<@${userId}>`, inline: true },
    )
    .setTimestamp();

  if (closed) {
    embed.setDescription("تم إغلاق هذه التذكرة.");
  } else if (claimedBy) {
    embed.setDescription(`✅ تم الاستلام بواسطة <@${claimedBy}>\n\nاختر طريقة الدفع من الأزرار أدناه. سيتم إرسال تفاصيل التحويل بشكل خاص.`);
  } else {
    embed.setDescription(
      "اختر طريقة الدفع المناسبة من الأزرار أدناه.\nسيتم إرسال تفاصيل التحويل إليك بشكل خاص.",
    );
    embed.setFooter({ text: "بعد التحويل، أرسل إيصال الدفع في هذه القناة" });
  }

  return embed;
}

async function handleBankButton(
  interaction: ButtonInteraction,
  bankKey: BankKey,
): Promise<void> {
  const bank = BANK_DATA[bankKey];
  const embed = new EmbedBuilder()
    .setTitle(`🏦 ${bank.label} — تفاصيل التحويل`)
    .setColor(bank.color)
    .addFields(
      { name: "🏦 البنك", value: bank.bank, inline: false },
      { name: "👤 الاسم", value: bank.name, inline: false },
      { name: "💳 رقم الآيبان", value: `\`\`\`${bank.iban}\`\`\``, inline: false },
    )
    .setDescription("حوّل المبلغ المطلوب ثم أرسل إيصال الدفع في قناة الطلب.")
    .setFooter({ text: "🔒 هذه الرسالة مرئية لك فقط" });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleClaimButton(interaction: ButtonInteraction): Promise<void> {
  const msg = interaction.message;
  const embed = msg.embeds[0];
  if (!embed) return;

  const product = embed.fields.find((f) => f.name === "📦 المنتج")?.value ?? "";
  const price = embed.fields.find((f) => f.name === "💰 السعر")?.value?.replace(" ريال", "") ?? "";
  const userField = embed.fields.find((f) => f.name === "👤 العضو")?.value ?? "";
  const userId = userField.replace(/[<@>]/g, "");

  const newEmbed = buildOrderEmbed(product, price, userId, interaction.user.id);

  await msg.edit({
    embeds: [newEmbed],
    components: [buildPaymentRow(), buildAdminRow()],
  });

  await interaction.reply({
    content: `✅ <@${interaction.user.id}> استلم هذه التذكرة.`,
  });
}

async function handleCloseButton(interaction: ButtonInteraction): Promise<void> {
  const msg = interaction.message;
  const embed = msg.embeds[0];
  if (!embed) return;

  const product = embed.fields.find((f) => f.name === "📦 المنتج")?.value ?? "";
  const price = embed.fields.find((f) => f.name === "💰 السعر")?.value?.replace(" ريال", "") ?? "";
  const userField = embed.fields.find((f) => f.name === "👤 العضو")?.value ?? "";
  const userId = userField.replace(/[<@>]/g, "");

  const closedEmbed = buildOrderEmbed(product, price, userId, undefined, true);

  await msg.edit({
    embeds: [closedEmbed],
    components: [buildPaymentRow(), buildAdminRow(true)],
  });

  await interaction.reply({
    content: `🔒 تم إغلاق التذكرة بواسطة <@${interaction.user.id}>.`,
  });
}

async function handleOrderCommand(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const product = interaction.options.getString("product", true);
  const price = interaction.options.getString("price", true);
  const config = loadConfig();

  const embed = buildOrderEmbed(product, price, interaction.user.id);

  const roleMention = config.adminRoleId ? `<@&${config.adminRoleId}>` : "";
  const userMention = `<@${interaction.user.id}>`;

  const content = [
    `📬 تذكرة جديدة من ${userMention}`,
    roleMention ? `🔔 ${roleMention}` : "",
  ]
    .filter(Boolean)
    .join("  |  ");

  await interaction.reply({
    content,
    embeds: [embed],
    components: [buildPaymentRow(), buildAdminRow()],
    allowedMentions: { users: [interaction.user.id], roles: config.adminRoleId ? [config.adminRoleId] : [] },
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
      content: "❌ تحتاج صلاحية **Administrator** أو **Manage Server** لاستخدام هذا الأمر.",
      ephemeral: true,
    });
    return;
  }

  const role = interaction.options.getRole("role", true);
  const config = loadConfig();
  config.adminRoleId = role.id;
  saveConfig(config);

  await interaction.reply({
    content: `✅ تم ضبط رتبة الإدارة على ${role.toString()}.\nستُذكر هذه الرتبة تلقائياً عند فتح كل تذكرة.`,
    ephemeral: true,
  });
}

export async function startBot(): Promise<void> {
  const token = process.env["DISCORD_BOT_TOKEN"];
  const enabled = process.env["DISCORD_ENABLED"];

  if (!token || enabled !== "true") {
    logger.info("Discord bot is disabled (DISCORD_ENABLED != true or no token)");
    return;
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  const commands = [
    new SlashCommandBuilder()
      .setName("order")
      .setDescription("فتح تذكرة شراء منتج مع خيارات الدفع")
      .addStringOption((opt) =>
        opt.setName("product").setDescription("اسم المنتج الذي تريد شراءه").setRequired(true),
      )
      .addStringOption((opt) =>
        opt.setName("price").setDescription("سعر المنتج بالريال").setRequired(true),
      )
      .toJSON(),
    new SlashCommandBuilder()
      .setName("setup")
      .setDescription("ضبط رتبة الإدارة التي ستُذكر عند فتح التذاكر")
      .addRoleOption((opt) =>
        opt.setName("role").setDescription("رتبة الإدارة").setRequired(true),
      )
      .toJSON(),
  ];

  client.once("ready", async (c) => {
    logger.info({ tag: c.user.tag }, "Discord bot is ready");
    const rest = new REST({ version: "10" }).setToken(token);
    try {
      await rest.put(Routes.applicationCommands(c.user.id), { body: commands });
      logger.info("Slash commands registered (order, setup)");
    } catch (err) {
      logger.error({ err }, "Failed to register slash commands");
    }
  });

  client.on("interactionCreate", async (interaction: Interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        if (interaction.commandName === "order") {
          await handleOrderCommand(interaction);
        } else if (interaction.commandName === "setup") {
          await handleSetupCommand(interaction);
        }
        return;
      }

      if (interaction.isButton()) {
        const id = interaction.customId;
        if (id === "pay_rajhi") await handleBankButton(interaction, "rajhi");
        else if (id === "pay_alinma") await handleBankButton(interaction, "alinma");
        else if (id === "pay_yourpay") await handleBankButton(interaction, "yourpay");
        else if (id === "ticket_claim") await handleClaimButton(interaction);
        else if (id === "ticket_close") await handleCloseButton(interaction);
      }
    } catch (err) {
      logger.error({ err }, "Error handling interaction");
    }
  });

  client.on("error", (err) => {
    logger.error({ err }, "Discord client error");
  });

  await client.login(token);
}
