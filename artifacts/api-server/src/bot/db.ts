import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "..", "data");
const DB_FILE = join(DATA_DIR, "database.json");

type DbValue = string | number | boolean | Record<string, unknown> | null;
type DbData = Record<string, DbValue>;

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadData(): DbData {
  ensureDataDir();
  if (!existsSync(DB_FILE)) return {};
  try {
    return JSON.parse(readFileSync(DB_FILE, "utf-8")) as DbData;
  } catch {
    return {};
  }
}

function saveData(data: DbData): void {
  ensureDataDir();
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  get(key: string): DbValue {
    return loadData()[key] ?? null;
  },
  set(key: string, value: DbValue): void {
    const data = loadData();
    data[key] = value;
    saveData(data);
  },
  delete(key: string): void {
    const data = loadData();
    delete data[key];
    saveData(data);
  },
};
