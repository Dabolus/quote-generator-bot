import { URLSearchParams } from 'url';

import puppeteer from 'puppeteer';
import { User } from 'node-telegram-bot-api';

export const host = 'localhost';
export const port = 40736;

export const quoteWidth = 960;
export const quoteHeight = 1280;

export const browserPromise = puppeteer.launch({ headless: true });

export const sanitize = (str: string) =>
  str.replace(
    /[&"'<>]/g,
    char =>
      ({
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
        '<': '&lt;',
        '>': '&gt;',
      }[char as '&' | '"' | "'" | '<' | '>']),
  );

export const highlight = (str: string) =>
  str.replace(/\w+/gi, word =>
    /(?:[aei]r(?:e|ti|tel[aeio])|mai|sempre|comunque|d?ovunque|qualunque|issim[aeio])$/.test(
      word,
    )
      ? `<strong>${word}</strong>`
      : word,
  );

export const getRandomArrayElement = (arr: any[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export const standardFonts = [
  'Lato',
  'Assistant',
  'Acme',
  'Domine',
  'Bree Serif',
  'Gudea',
  'Amaranth',
  'Palanquin',
  'Gentium Basic',
  'Oswald',
  'Raleway',
  'PT Sans',
  'Rubik',
  'Jost',
];

export const fancyFonts = [
  'Langar',
  'Yellowtail',
  'Lobster Two',
  'Dancing Script',
  'Pacifico',
  'Indie Flower',
  'Euphoria Script',
  'Satisfy',
  'Courgette',
  'Sacramento',
  'Gloria Hallelujah',
  'Parisienne',
  'Cookie',
  'Handlee',
  'Merienda',
];

export const fonts = [...standardFonts, ...fancyFonts];

export const getRandomFont = (style: 'all' | 'standard' | 'fancy' = 'all') => {
  const array =
    style === 'all' ? fonts : style === 'standard' ? standardFonts : fancyFonts;
  return getRandomArrayElement(array);
};

export const colors = ['#65da88', '#e7af59', '#47a2ba'];

export const getRandomColor = () => getRandomArrayElement(colors);

export const generateImage = async (query: string, author: string) => {
  console.info(`Received query "${query}"`);

  const browser = await browserPromise;
  const page = await browser.newPage();
  await page.setViewport({ width: quoteWidth, height: quoteHeight });

  console.info('Generating page...');

  await page.goto(
    `http://${host}:${port}?${new URLSearchParams({
      query,
      author,
    }).toString()}`,
    { waitUntil: 'networkidle0' },
  );

  console.info('Exporting page image...');

  const image = await page.screenshot({
    type: 'jpeg',
    quality: 80,
  });

  console.info('Closing browser...');

  await page.close();

  return image;
};

export const formatName = ({ first_name, last_name }: User) =>
  `${first_name}${last_name ? ` ${last_name}` : ''}`;
