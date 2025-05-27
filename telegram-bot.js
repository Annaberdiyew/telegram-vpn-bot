const TelegramBot = require('node-telegram-bot-api');

const token = '7500177629:AAEJUMFnpqRB_1pMjBmPC_mCBmHrx7o1D_c';
const bot = new TelegramBot(token, { polling: true });

// Kanallaryň ID'leri
const channels = ['@aronvpn', '@Aronvpn2', '@aronvpn1'];

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔐 VPN Al', callback_data: 'vpn_al' }]
      ]
    }
  };

  
  bot.sendMessage(chatId, 'Hoş geldiňiz! VPN almak üçin aşakdaky düwmä basyň.', options);
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'vpn_al') {
    let kanalText = 'Ilki aşakdaky kanallara agza boluň:\n\n';
    channels.forEach(k => {
      kanalText += "👉 " + k + "\n";
    });
    kanalText += '\nAgza bolanyňyzdan soň aşakdaky "✅ Barladym" düwmesine basyň.';

    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Barladym', callback_data: 'check_membership' }]
        ]
      }
    };

    bot.sendMessage(chatId, kanalText, options);
  }

  if (data === 'check_membership') {
    let allJoined = true;

    for (const channel of channels) {
      try {
        const res = await bot.getChatMember(channel, query.from.id);
        if (res.status !== 'member' && res.status !== 'administrator' && res.status !== 'creator') {
          allJoined = false;
          break;
        }
      } catch (error) {
        console.log("Error barlanda:", error);
        allJoined = false;
        break;
      }
    }

    if (allJoined) {
      // Ulanyjy agza bolsa VPN kody berilýär
      const kod = "vless://f9e1a09f-0b12-40be-9eb3-b5ed0f914179@45.196.218.132:30805?security=&encryption=none&headerType=&type=tcp#ismail-Aron";
      bot.sendMessage(chatId, `🎉 Gutlaýarys! Ine siziň VPN kodyňyz:\n\n${kod}`);
    } else {
      // Agza bolmadyk bolsa
      bot.sendMessage(chatId, '📛 Bagyşlaň, ähli kanallara agza bolmagyňyz gerek!');
    }
  }
});
