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
  type Interaction,
  type ChatInputCommandInteraction,
  type ButtonInteraction,
  ComponentType,
} from "discord.js";
import { logger } from "../lib/logger";

const BANK_DATA = {
  rajhi: {
    label: "🏦 الراجحي",
    iban: "SA66 8000 0386 6080 1607 8150",
    name: "عمر العنزي",
    bank: "بنك الراجحي",
    color: 0x006400,
  },
  alinma: {
    label: "🏦 الإنماء",
    iban: "SA1205000068207423526001",
    name: "خالد المطيري",
    bank: "بنك الإنماء",
    color: 0x0055a5,
  },
  yourpay: {
    label: "💳 يور باي",
    iban: "SA7780207092580222121019",
    name: "خالد المطيري",
    bank: "يور باي",
    color: 0x7c3aed,
  },
} as const;

type BankKey = keyof typeof BANK_DATA;

function buildPaymentButtons(): ActionRowBuilder<ButtonBuilder> {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
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
  return row;
}

function buildOrderEmbed(product: string, price: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("🛒 طلب شراء")
    .setColor(0xf59e0b)
    .addFields(
      { name: "📦 المنتج", value: product, inline: true },
      { name: "💰 السعر", value: `${price} ريال`, inline: true },
    )
    .setDescription(
      "اختر طريقة الدفع المناسبة لك من الأزرار أدناه.\nسيتم إرسال تفاصيل التحويل إليك بشكل خاص.",
    )
    .setFooter({ text: "بعد التحويل، أرسل إيصال الدفع في هذه القناة" })
    .setTimestamp();
}

async function handleBankButton(
  interaction: ButtonInteraction,
  bankKey: BankKey,
): Promise<void> {
  const bank = BANK_DATA[bankKey];
  const embed = new EmbedBuilder()
    .setTitle(`${bank.label} — تفاصيل التحويل`)
    .setColor(bank.color)
    .addFields(
      { name: "🏦 البنك", value: bank.bank, inline: false },
      { name: "👤 الاسم", value: bank.name, inline: false },
      { name: "💳 رقم الآيبان", value: `\`\`\`${bank.iban}\`\`\``, inline: false },
    )
    .setDescription("حوّل المبلغ المطلوب ثم أرسل إيصال الدفع في قناة الطلب.")
    .setFooter({ text: "هذه الرسالة مرئية لك فقط" });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleOrderCommand(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const product = interaction.options.getString("product", true);
  const price = interaction.options.getString("price", true);

  const embed = buildOrderEmbed(product, price);
  const row = buildPaymentButtons();

  await interaction.reply({ embeds: [embed], components: [row] });
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
        opt
          .setName("product")
          .setDescription("اسم المنتج الذي تريد شراءه")
          .setRequired(true),
      )
      .addStringOption((opt) =>
        opt
          .setName("price")
          .setDescription("سعر المنتج بالريال")
          .setRequired(true),
      )
      .toJSON(),
  ];

  client.once("ready", async (c) => {
    logger.info({ tag: c.user.tag }, "Discord bot is ready");

    const rest = new REST({ version: "10" }).setToken(token);
    try {
      await rest.put(Routes.applicationCommands(c.user.id), { body: commands });
      logger.info("Slash commands registered globally");
    } catch (err) {
      logger.error({ err }, "Failed to register slash commands");
    }
  });

  client.on("interactionCreate", async (interaction: Interaction) => {
    try {
      if (interaction.isChatInputCommand() && interaction.commandName === "order") {
        await handleOrderCommand(interaction);
        return;
      }

      if (interaction.isButton()) {
        if (interaction.customId === "pay_rajhi") {
          await handleBankButton(interaction, "rajhi");
        } else if (interaction.customId === "pay_alinma") {
          await handleBankButton(interaction, "alinma");
        } else if (interaction.customId === "pay_yourpay") {
          await handleBankButton(interaction, "yourpay");
        }
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
