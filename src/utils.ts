import puppeteer from 'puppeteer';
import { User } from 'node-telegram-bot-api';

export const quoteWidth = 960;
export const quoteHeight = 1280;

export const browserPromise = puppeteer.launch({ headless: true });

export const sanitize = (str: string) =>
  str.replace(
    /[&"'<>]/g,
    (char) =>
      ({
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
        '<': '&lt;',
        '>': '&gt;',
      }[char as '&' | '"' | "'" | '<' | '>']),
  );

export const highlight = (str: string) =>
  str.replace(/\w+/gi, (word) =>
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
  return getRandomArrayElement(fonts);
};

export const colors = ['#65da88', '#e7af59', '#47a2ba'];

export const getRandomColor = () => getRandomArrayElement(colors);

export const generateImage = async (query: string, author: string) => {
  console.info(`Received query "${query}"`);

  const browser = await browserPromise;
  const page = await browser.newPage();
  await page.setViewport({ width: quoteWidth, height: quoteHeight });

  console.info('Generating page...');

  const quoteFont = getRandomFont();
  const authorFont = getRandomFont();
  const highlightFont =
    Math.random() < 0.75 ? quoteFont : getRandomFont('fancy');

  await page.setContent(
    `
      <!doctype html>
      <html>
        <head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=${quoteFont.replace(
            / /g,
            '+',
          )}:400,b,i,bi|${authorFont.replace(/ /g, '+')}:400,b,i,bi">
          <style>
            * { box-sizing: border-box; }
            html, body, div { width: 100%; height: 100%; margin: 0; padding: 0; }
            body {
              background: url('https://source.unsplash.com/${quoteWidth}x${quoteHeight}/?inspiring');
            }
            div {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: linear-gradient(${
                Math.random() < 0.5 ? 0 : 180
              }deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.9) 100%);
              gap: ${quoteWidth / 40}px;
              padding: ${quoteWidth / 20}px;
            }
            p {
              margin: 0;
              color: #fff;
              text-align: center;
            }
            #quote {
              font-family: '${quoteFont}';
              font-size: 96px;
              font-variant: ${Math.random() < 0.75 ? 'normal' : 'small-caps'};
            }
            strong {
              font-style: ${Math.random() < 0.75 ? 'normal' : 'italic'};
              font-weight: ${Math.random() < 0.75 ? 'normal' : 'bold'};
              font-family: '${highlightFont}';
            }
            #author {
              font-family: '${authorFont}';
              font-size: 90px;
            }
            strong, #author {
              color: ${getRandomColor()};
            }
          </style>
        </head>
        <body>
          <div>
            <p id="quote">
              ${highlight(sanitize(query))}
            </p>
            <p id="author">
              — ${sanitize(author)}
            </p>
          </div>
        </body>
      </html>
    `,
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
