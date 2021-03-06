var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js'); //predic
const cls_model = require ('./sdk/cls_model.js'); //cls

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1886757664:AAER5X02MM9d7RgTQQ4bJ_Xl6mwoefLuVwQ'
const bot = new TelegramBot(token, {polling: true});

state = 0;
// Main Menu Bot
bot.onText(/\/start/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /predict`
    );
    state = 0;
});

//input requires i dan r 
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `masukkan nilai i|v contoh 9|9`
    );
    state = 1
});

bot.on('message', (msg) => {
    if(state == 1){
	s = msg.text.split("|");
	i = parseFloats(s[0])
	v = parseFLoat(s[1])
        
	model.predict(
	    [
		i, // string to float
		r
	    ]
	).then((jres1)=>{
	    v = parseFloat(jres1[0])
	    p = parseFloat(jres1[1])
			
	    cls_model.classify([i, r, v, p]).then((jres2)=> {
		bot.sendMessage(
			msg.chat.id,
			`nilai v yang diprediksi adalah ${v} volt`
		);
		bot.sendMessage(
			msg.chat.id,
			`nilai p yang diprediksi adalah ${p} watt`
		);
			bot.sendMessage(
			msg.chat.id,
			`Klasifikasi Tegangan ${jres2}`
		);
		
	    })
	})
    }else {
        state = 0 
        }
})

// routers
r.get('/classify/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        cls_model.classify(
            [
                parseFloat(req.params.i), // string to float
                parseFloat(req.params.r)
                parseFloat(jres[0])
                parseFloat(jres[1])
            ]
    	).then((jres)=>{
            res.json(jres);
    	})
    })
});

module.exports = r;
