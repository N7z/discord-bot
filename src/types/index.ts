import { Message } from 'discord.js';

export interface CommandMeta {
  execute: (msg: Message) => Promise<void>;
  isAdminOnly?: boolean;
}
