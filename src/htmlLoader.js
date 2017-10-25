const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const mycss = fs.readFileSync(`${__dirname}/../client/style.css`);
const tUp = fs.readFileSync(`${__dirname}/../client/images/thumbs_up.svg`);
const tDown = fs.readFileSync(`${__dirname}/../client/images/thumbs_down.svg`);

// returns index.html page
const getIndex = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(index);
  res.end();
};

// returns style.css sheet
const loadCSS = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.write(mycss);
  res.end();
};

// returns an image
const loadThumbsUp = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
  res.write(tUp);
  res.end();
};

// returns an image
const loadThumbsDown = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
  res.write(tDown);
  res.end();
};

module.exports = {
  loadCSS,
  getIndex,
  loadThumbsUp,
  loadThumbsDown,
};
