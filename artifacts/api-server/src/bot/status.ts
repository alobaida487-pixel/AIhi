interface BotStatus {
  enabled: boolean;
  connected: boolean;
  tag: string | null;
  error: string | null;
}

const status: BotStatus = {
  enabled: false,
  connected: false,
  tag: null,
  error: null,
};

export function setStatus(update: Partial<BotStatus>): void {
  Object.assign(status, update);
}

export function getStatus(): BotStatus {
  return { ...status };
}
