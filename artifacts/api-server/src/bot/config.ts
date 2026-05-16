import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "..", "data");
const CONFIG_FILE = join(DATA_DIR, "bot-config.json");

interface BotConfig {
  adminRoleId: string | null;
}

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadConfig(): BotConfig {
  ensureDataDir();
  if (!existsSync(CONFIG_FILE)) {
    return { adminRoleId: null };
  }
  try {
    const raw = readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(raw) as BotConfig;
  } catch {
    return { adminRoleId: null };
  }
}

export function saveConfig(config: BotConfig): void {
  ensureDataDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}
