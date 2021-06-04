var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js'); //Predict
const cls_model = require('./sdk/model.js'); //cls

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1566520999:AAG5DMEg1XgTEDULZBFxO41hcCWGL6MIb_0'
const bot = new TelegramBot(token, {polling: true});


// Main Menu Bot
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /predict`
    );   
});

state = 0;
bot.onText(/\/predict/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `masukkan nilai i|v contoh 9|9`
    );   
    state = 1
});



bot.on('message', (msg) => {
	if(state == 1){
		console.log(msg.Text);
		s = msg.text.split("|");
		i = parseFloats(s[0])
		v = parseFLoat(s[1])
        
		model.predict(
			[
				i,
				r
			]
		).then((jres1)=>{
            v = parseFloatjres1[0]
            p = parseFloatjres1[1]
            
            cls_model.classify([i, r, v, p]).then((jres2)=> { 
            
			bot.sendMessage(
				msg.chat.id,
				`nilai v yang diprediksi adalah ${jres[0]} volt`
        );
            bot.sendMessage(
                msg.chat.id,
                `nilai p yang diprediksi adalah ${jres[1]} watt`
        );
            bot.sendMessage(
				msg.chat.id,
				`Klasifikasi Tegangan ${jres[2]} volt`
        );
        })
    })
		state = 0
    }else {
        state = 0 
        }
})

// routers
r.get('/classify/:i/:r', function(req, res, next) {    
    model.classify(
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
