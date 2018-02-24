require('dotenv').config()
const linebot = require('linebot');
const express = require('express');

const bot = linebot({
  channelId: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESSTOKEN
});

const app = express();

const linebotParser = bot.parser();

app.post('/webhook', linebotParser);

bot.on('message', function (event) {
    const copy = event.message.text
  event.reply([copy,copy]).then(function (data) {
    console.log('Success', data);
  }).catch(function (error) {
    console.log('Error', error);
  });
});

app.listen(process.env.PORT || 8080, function () {
  console.log('LineBot is running.');
});