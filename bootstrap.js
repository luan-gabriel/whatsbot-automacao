const { exec } = require('child_process');

console.log('🚀 Executando Puppeteer (scrape)...');

const scrapeProcess = exec('npm run puppeteer');

scrapeProcess.stdout.on('data', (data) => process.stdout.write(data));
scrapeProcess.stderr.on('data', (data) => process.stderr.write(data));

scrapeProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error('❌ Puppeteer encontrou um erro. Abortando.');
    return;
  }

  console.log('✅ Puppeteer finalizado. Iniciando Frontend e Backend...\n');

  const devProcess = exec('npm run dev');

  devProcess.stdout.on('data', (data) => process.stdout.write(data));
  devProcess.stderr.on('data', (data) => process.stderr.write(data));
});
