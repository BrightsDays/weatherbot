const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const token = '';
let CronJob = require('cron').CronJob;

const notifications = {
  Clear: 'чистое небо, зонт не пригодится.',
  Clouds: 'облачно, стоит захватить зонтик (или хотя бы куртку с капюшоном).',
  Thunderstorm: 'ожидается гроза, возьмите зонт!',
  Drizzle: 'слегка моросит, подготовьтесь к этому.',
  Snow: 'будет зимний снег!',
  Rain: 'будет дождь, возьмите зонтик!'
  //[
  //  'легкий дождь, стоит захватить зонтик (или хотя бы куртку с капюшоном).',
  //  'будет сильный дождь, возьмите зонтик!'
  //]
};

let fetchRain = (selector, token, id) => {
  let url = `http://api.openweathermap.org/data/2.5/onecall?lat=59.938480&lon=-30.312481&exclude=current,minutely,hourly,alerts&required=pop&appid=${token}`;
  let settings = { method: "Get" };
  fetch(url, settings)
  .then(res => res.json())
  .then((json) => {
    let ntf = notifications[json.daily[0].weather[0].main];
    bot.sendMessage(id, `сегодня ${ntf}`);
  });
};

const bot = new TelegramBot(token, {
  polling: true
});

bot.onText(/\/start/, (msg) => {
    
  bot.sendMessage(msg.chat.id, "Привет, я Weatherinder!", {
    "reply_markup": {
			'resize_keyboard': true,
      "keyboard": [
        ["Предупреждай меня об осадках по утрам"],
        ["Который час?", "Пасмурно ли в С-Пб?"]
      ]
    }
  });
});

bot.on('message', (msg) => {
  
  const chatId = msg.chat.id;

  let remind = "Предупреждай меня об осадках по утрам";
  if (msg.text.indexOf(remind) === 0) {
    bot.sendMessage(chatId, 'Буду напоминать о погоде ежедневно в 08:00');
    let job = new CronJob('00 00 08 * * *', function() {
      fetchRain('Saint Petersburg', '', chatId);
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

  let weather = "Пасмурно ли в С-Пб?";
  if (msg.text.indexOf(weather) === 0) {
    fetchRain('Saint Petersburg', '', chatId);
  }
});