const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const token = '';

const bot = new TelegramBot(token, {
  polling: true
});

bot.onText(/\/start/, (msg) => {
    
  bot.sendMessage(msg.chat.id, "Привет, я Weatherinder!", {
    "reply_markup": {
			'resize_keyboard': true,
      "keyboard": [
        ['10 mins'],
        ["Привет, я Лена", "Напоминай мне о погоде по утрам"],
        ["Который час?", "Что по погоде в С-Пб?"]
      ]
    }
  });
});

bot.on('message', (msg) => {
  
  const chatId = msg.chat.id;

  let ten = "10 mins";
  if (msg.text.indexOf(ten) === 0) {
    var CronJob = require('cron').CronJob;
    var job = new CronJob('00 20 16 * * *', function() {
      const d = new Date();
      bot.sendMessage(chatId, '4-20:');
    });
    job.start();
  }

  let helen = "Привет, я Лена";
  if (msg.text.indexOf(helen) === 0) {
      bot.sendMessage(chatId, 'Люблю тебя!');
  }

  let remind = "Напоминай мне о погоде по утрам";
  if (msg.text.indexOf(remind) === 0) {
    bot.sendMessage(chatId, 'Буду спамить до 21:00');
    let CronJob = require('cron').CronJob;
    let job = new CronJob('00 */30 17-21 * * *', function() {
      let fetchRain = (selector, token) => {
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${selector}&APPID=${token}`;
        let settings = { method: "Get" };
        fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
          bot.sendMessage(chatId, json.weather[0].description);
        });
      };
  
      fetchRain('Saint Petersburg', '');
    });
    job.start();
  }

  let time = "Который час?";
  if (msg.text.indexOf(time) === 0) {
    let date = new Date();
    let hours = date.getHours();
    let mins = date.getMinutes();
    bot.sendMessage(chatId, `${hours}:${mins}`);
  }

  let weather = "Что по погоде в С-Пб?";
  if (msg.text.indexOf(weather) === 0) {

    let fetchRain = (selector, token) => {
      let url = `http://api.openweathermap.org/data/2.5/weather?q=${selector}&APPID=${token}`;
      let settings = { method: "Get" };
      fetch(url, settings)
      .then(res => res.json())
      .then((json) => {
        bot.sendMessage(chatId, json.weather[0].description);
      });
    };

    fetchRain('Saint Petersburg', '');
  }
});

//bot.onText(/\/echo (.+)/, (msg, match) => {
//
//  const chatId = msg.chat.id;
//  const resp = match[1];
//
//  bot.sendMessage(chatId, resp);
//});

//bot.onText(/\b|погод/g, (msg) => {
//  const chatId = msg.chat.id;
//  
//  let fetchRain = (selector, token) => {
//    let url = `http://api.openweathermap.org/data/2.5/weather?q=${selector}&APPID=${token}`;
//    let settings = { method: "Get" };
//    fetch(url, settings)
//    .then(res => res.json())
//    .then((json) => {
//        bot.sendMessage(chatId, json.weather[0].description);
//    });
//  };
//  fetchRain('Saint Petersburg', '');
//});

//bot.on('message', (msg) => {
//  const chatId = msg.chat.id;
//
//  bot.sendMessage(chatId, "Привет, я бот", {
//    reply_markup: {
//      inline_keyboard: keyboard
//    }
//  });
//});

//const keyboard = [
//  [{
//    text: 'Привет, я Лена',
//    callback_data: 'helen'
//  }],
//  [{
//    text: 'Который час?',
//    callback_data: 'time'
//  }],
//  [{
//    text: 'Что по погоде в С-Пб?',
//    callback_data: 'weather'
//  }]
//];

//bot.on('callback_query', (query) => {
//  const chatId = query.message.chat.id;
//
//  if (query.data === 'helen') {
//    bot.sendMessage(chatId, 'Люблю тебя!');
//  } else if (query.data === 'time') {
//    let date = new Date();
//    let hours = date.getHours();
//    let mins = date.getMinutes();
//    bot.sendMessage(chatId, `${hours}:${mins}`);
//  } else if (query.data === 'weather') {
//
//    let fetchRain = (selector, token) => {
//        const fetch = require('node-fetch');
//        let url = `http://api.openweathermap.org/data/2.5/weather?q=${selector}&APPID=${token}`;
//        let settings = { method: "Get" };
//        fetch(url, settings)
//        .then(res => res.json())
//        .then((json) => {
//            bot.sendMessage(chatId, json.weather[0].description);
//        });
//    };
//    fetchRain('Saint Petersburg', '');
//  }
//});