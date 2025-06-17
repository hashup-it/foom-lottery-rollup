const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');
const js = fs.readFileSync('public/bundle.js', 'utf8');
const inlined = html.replace(
  '<script src="./bundle.js"></script>',
  `<script>${js}</script>`
);

fs.writeFileSync('public/index.inlined.html', inlined);
console.log('Created public/index.inlined.html');
