const brotli = require('brotli')
const fs = require('fs')
const chalk = require('chalk');

const brotliSettings = {
    extension: 'br',
    skipLarger: true,
    mode: 1, // 0 = generic, 1 = text, 2 = font (WOFF2)
    quality: 11,
    lgwin: 12
};

console.log('');
console.log(chalk.green.bold('[Brotly compress start]'));
console.log('------------------------------------');

fs.readdirSync('dist').forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
        console.log(chalk.yellow.bold('[Cжатие]', file));
        const result = brotli.compress(fs.readFileSync('dist/' + file), brotliSettings)
        fs.writeFileSync('dist/' + file + '.br', result)
    }
})

console.log('------------------------------------');
console.log(chalk.green.bold('[Brotly compress complete]'));