'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const Q = require('q');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var credentialsConstructor = require('./config/credentials.js');
//const usedCredHere = credentialsConstructor.getWorkspaceCredentials("conversation-simple-example");
const usedCredHere = credentialsConstructor.getWorkspaceCredentials("bluehack");

// Set up Conversation service wrapper.
var conversation = new ConversationV1({
  username: usedCredHere.username, // replace with username from service key
  password: usedCredHere.password, // replace with password from service key
  path: { workspace_id: usedCredHere.WorkspaceID }, // replace with workspace ID
  version_date: '2017-05-11'
});


const app = express();

app.set('port', (process.env.PORT || 5000));

//allows us to process data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


// ROUTES
app.get('/', function(req,res){
    res.send("Hi, I am Joy !!");
});

//token generated by facebook
let token = "EAASR0eAjHecBABlBwEP25oNo5X4bdZCAr2HwwjTOxDvhoLawUDopxZCnEZBK89RTIR6CX2saHGsLZAzk8BeMoxCzwwfIacA8OcBpG5qp49Xr7DZBGw00Obzrn5bSguL2NBUfgiV1ks9ZCFpwYQUnhuYQZC3DRdLgMB9fNhE6yc4gAZDZD";


//Facebook

app.get('/webhook/',function(req,res){
    if(req.query['hub.verify_token'] === 'blondiebytes'){
        res.send(req.query['hub.challenge']);
    }
    res.send('Wrong token ...');
});



app.post('/webhook/',function(req,res){
    let messaging_events = req.body.entry[0].messaging;
    for(let i = 0; i<messaging_events.length;i++){
        let event = messaging_events[i];
        let sender = event.sender.id;
        if(event.message && event.message.text){
            let text = event.message.text;
            text = text.toLowerCase();

        }
    }
    res.sendStatus(200);
});


function sendText(sender, text){
 let messageData = {text: text};
 request({
     url:"https://graph.facebook.com/v2.6/me/messages",
     qs: {access_token: token},
     method:"POST",
     json:{
         recipient:{id: sender},
         message: messageData
     }
 },function(error, response, body){
    if(error){
       console.log("Error: ", error);
    }
    else if(response.body.error){
        console.log("Response body error: ", response.body.error);
    }
 }
 );
}

app.listen(app.get('port'),function(){
    console.log("Running on port: ", app.get('port'));
});