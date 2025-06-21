const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

let page = null;
let browser = null;

async function startWhatsApp() {
  if (page && !page.isClosed()) {
    console.log('ℹ️ WhatsApp já iniciado.');
    return;
  }

  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto('https://web.whatsapp.com');

  console.log('💬 Aguardando login no WhatsApp...');
  await page.waitForSelector('div[role="grid"]', { timeout: 0 });
  console.log('✅ Login realizado com sucesso!');
}

async function getVisibleContacts() {
  if (!page) return [];

  return await page.$$eval('div[role="grid"] > div', contactNodes =>
    contactNodes.slice(0, 10).map(el => {
      const name = el.querySelector('span[title]')?.getAttribute('title') || 'Desconhecido';
      const lastMessage = el.querySelector('div[dir="ltr"]')?.textContent || '';
      const time = el.querySelector('div[role="gridcell"] span[aria-label]')?.textContent || '';
      const avatar = null;

      return { name, lastMessage, time, avatar };
    })
  );
}

async function getMessagesFromChat() {
  if (!page) return [];

  await page.waitForSelector('div[data-testid="conversation-panel-messages"]', { timeout: 5000 });

  return await page.$$eval('div[data-testid="msg-container"]', nodes =>
    nodes.map(el => {
      const span = el.querySelector('span.selectable-text');
      const text = span ? span.innerText : '';
      const timeElement = el.querySelector('div[data-pre-plain-text]');
      const timeMatch = timeElement?.dataset?.prePlainText?.match(/\[(.*?)\]/);
      const time = timeMatch ? timeMatch[1] : '';
      const sent = el.className.includes('message-out');
      const sender = sent ? 'Você' : 'Contato';

      return { sender, text, time };
    })
  );
}

async function selectContactByName(name) {
  if (!page) return false;

  const contactHandles = await page.$$(`div[role="grid"] > div`);

  for (const el of contactHandles) {
    const title = await el.$eval('span[title]', span => span.getAttribute('title')).catch(() => null);
    if (title && title.toLowerCase() === name.toLowerCase()) {
      await el.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    }
  }

  return false;
}

async function enviarMensagemViaPuppeteer(name, texto) {
  if (!page) {
    console.log('❌ Puppeteer ainda não está conectado.');
    return false;
  }

  const sucesso = await selectContactByName(name);
  if (!sucesso) {
    console.log(`⚠️ Contato "${name}" não encontrado na interface.`);
    return false;
  }

  try {
    await page.waitForSelector('footer div[contenteditable="true"]', { timeout: 5000 });
    await page.type('footer div[contenteditable="true"]', texto, { delay: 50 });

    const botao = await page.$('footer button span[data-icon="send"]');
    if (botao) {
      await botao.click();
      console.log(`📤 Mensagem enviada para "${name}": ${texto}`);
      return true;
    } else {
      console.warn('⚠️ Botão de enviar não encontrado.');
      return false;
    }
  } catch (e) {
    console.error('❌ Erro ao enviar mensagem via Puppeteer:', e);
    return false;
  }
}

function gerarAvatarFicticio(nome, indice) {
  const primeiroNome = nome.trim().split(' ')[0].toLowerCase();

  if (primeiroNome.endsWith('a')) {
    return `/avatars/female${(indice % 5) + 1}.png`; // female1.png até female5.png
  }
  if (primeiroNome.endsWith('o')) {
    return `/avatars/male${(indice % 5) + 1}.png`; // male1.png até male5.png
  }
  return `/avatars/neutral${(indice % 3) + 1}.png`; // neutral1.png até neutral3.png
}

async function extrairContatosParaArquivo() {
  if (!page) {
    console.log('❌ Página não iniciada. Execute startWhatsApp() antes.');
    return;
  }

  const contatos = await page.evaluate(() => {
    const lista = [];
    const contatoElements = document.querySelectorAll('div[role="grid"] > div');

    contatoElements.forEach(el => {
      const name = el.querySelector('span[title]')?.getAttribute('title');
      const lastMessage = el.querySelector('div[dir="ltr"]')?.textContent || '';
      const time = el.querySelector('div[role="gridcell"] span[aria-label]')?.textContent || '';

      if (name) {
        lista.push({ name, lastMessage, time });
      }
    });

    return lista;
  });

  // Atribui link de avatar via DiceBear
  contatos.forEach(contato => {
    const seed = encodeURIComponent(contato.name.trim());
    contato.avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
  });

  await fs.writeJson('./contatosExtraidos.json', contatos, { spaces: 2 });
  console.log(`✅ ${contatos.length} contatos salvos com avatares DiceBear no JSON`);
}


module.exports = {
  startWhatsApp,
  getVisibleContacts,
  getMessagesFromChat,
  selectContactByName,
  extrairContatosParaArquivo,
  enviarMensagemViaPuppeteer
};
