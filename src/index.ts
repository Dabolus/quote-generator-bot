import TelegramBot from 'node-telegram-bot-api';

import { startServer } from './server';
import { formatName, generateImage } from './utils';

if (!process.env.BOT_TOKEN) {
  console.error(
    'Please, specify a bot token using the BOT_TOKEN environment variable.',
  );
  process.exit(1);
}

startServer();
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(
  /\/quote(?:@GenQuoteBot)?\s*(.*)/,
  async (
    {
      chat: { id },
      reply_to_message: { text = '', from: replyFrom } = {},
      from,
    },
    match,
  ) => {
    const [, query] = match || [];

    const quoteText = text.trim() || query.trim();

    if (!quoteText) {
      return;
    }

    await bot.sendChatAction(id, 'upload_photo');

    const image = await generateImage(
      quoteText,
      formatName(text.trim() ? replyFrom! : from!),
    );

    console.info('Sending image...');

    await bot.sendPhoto(id, image);

    console.info('Done!');
  },
);
