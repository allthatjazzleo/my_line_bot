require('dotenv').config()
const linebot = require('linebot');
const express = require('express');
const {ACTION_TEXT_DRAW_BEAUTY, ACTION_TEXT_PASS, switchIncomingType} = require('./HandleIncoming/HandleIncoming_Text')

const ptt_beaty_crawler = require('./crawler/ptt_beaty_crawler')



const bot = linebot({
  channelId: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESSTOKEN
});

const app = express();

const linebotParser = bot.parser();

app.post('/webhook', linebotParser);

bot.on('message', function (event) {
    switch(event.message.type){
      case'text':
        const incomingString = event.message.text
        const resultObject = switchIncomingType(incomingString)
        
        switch (resultObject.type) {
          case ACTION_TEXT_DRAW_BEAUTY:
            //準備抽卡片
              ptt_beaty_crawler.getBeautyPageResult()
              .then(result => {
                if (!result.length) {
                  return
                }

                const randomInt = Math.floor(Math.random() * result.length)
                const articleObject = result[randomInt]

                const lineImageTemplate = {
                  "type": "image",
                  "originalContentUrl": articleObject.imageUrls[0],
                  "previewImageUrl": articleObject.imageUrls[0]
                 }
                 event.reply(lineImageTemplate)
                  

              }).catch(e => {
                console.log(e.message)
              })

              break;
          case ACTION_TEXT_PASS:
              
              event.reply(resultObject.value).then(function (data) {
                console.log('Success', data);
              }).catch(function (error) {
                console.log('Error', error);
              });

            break;
          default:
            break;
        }

        break;
      default:
        break;

    }



  
  
});

app.listen(process.env.PORT || 8080, function () {
  console.log('LineBot is running.');
});





// function sayHello () {

// }

// const sayHello = () => {

// }