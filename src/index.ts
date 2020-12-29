import { createCanvas } from 'canvas';
import TelegramBot from 'node-telegram-bot-api';

const QUOTE_WIDTH = 960;
const QUOTE_HEIGHT = 1280;

const canvas = createCanvas(QUOTE_WIDTH, QUOTE_HEIGHT);
const ctx = canvas.getContext('2d');

if (!process.env.BOT_TOKEN) {
  console.error(
    'Please, specify a bot token using the BOT_TOKEN environment variable.',
  );
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on('inline_query', ({ id, query }) => {
  console.log(query);
  bot.answerInlineQuery(id, [
    {
      type: 'photo',
      id: '1',
      photo_file_id: '',
      photo_url: '',
      thumb_url: '',
    },
  ]);
});
