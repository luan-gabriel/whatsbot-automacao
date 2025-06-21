const { startWhatsApp, extrairContatosParaArquivo } = require('./puppeteerBot');

(async () => {
  await startWhatsApp();
  await extrairContatosParaArquivo();

  process.exit(0); // garante que o processo finalize
})();
