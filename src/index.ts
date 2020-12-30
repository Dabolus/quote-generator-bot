import TelegramBot from 'node-telegram-bot-api';

import { generateImage } from './utils';

if (!process.env.BOT_TOKEN) {
  console.error(
    'Please, specify a bot token using the BOT_TOKEN environment variable.',
  );
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(
  /\/quote (.+)/,
  async ({ chat: { id }, from: { first_name, last_name } = {} }, match) => {
    const [, query] = match || [];

    if (!query.trim()) {
      return;
    }

    await bot.sendChatAction(id, 'upload_photo');

    const image = await generateImage(
      query.trim(),
      `${first_name}${last_name ? ` ${last_name}` : ''}`,
    );

    console.info('Sending image...');

    await bot.sendPhoto(id, image);

    console.info('Done!');
  },
);
