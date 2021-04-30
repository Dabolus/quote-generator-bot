import fsSync, { promises as fs } from 'fs';
import path from 'path';
import http from 'http';
import { URLSearchParams } from 'url';

import ejs from 'ejs';

import {
  host,
  port,
  getRandomFont,
  getRandomColor,
  quoteWidth,
  quoteHeight,
  highlight,
  sanitize,
  replaceEmojis,
} from './utils';

const templatePromise = fs
  .readFile(path.join(__dirname, '../assets/template.ejs'), 'utf8')
  .then(template => ejs.compile(template, { async: true }));

const emojisPath = path.join(__dirname, '../assets/emojis');

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(404);
    res.end();
    return;
  }

  if (req.url.includes('emojis')) {
    const emojiPath = path.join(
      emojisPath,
      req.url.slice(req.url.lastIndexOf('/') + 1),
    );
    fsSync.createReadStream(emojiPath).pipe(res);
    return;
  }

  const params = new URLSearchParams(req.url.slice(1));

  const query = params.get('query');
  const author = params.get('author');

  if (!query || !author) {
    res.writeHead(404);
    res.end();
    return;
  }

  const quoteFont = getRandomFont();
  const authorFont = getRandomFont();
  const highlightFont =
    Math.random() < 0.8 ? quoteFont : getRandomFont('fancy');

  const template = await templatePromise;

  const rendered = await template({
    quoteFont,
    authorFont,
    highlightFont,
    quoteWidth,
    quoteHeight,
    getRandomColor,
    highlight,
    sanitize,
    replaceEmojis,
    query,
    author,
  });

  res.writeHead(200);
  res.end(rendered);
});

export const startServer = () =>
  new Promise<void>(resolve =>
    server.listen(port, '0.0.0.0', () => {
      console.log(`Server started at ${host}:${port}`);
      resolve();
    }),
  );

startServer();
