var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var watson = require('watson-developer-cloud');
var app = express();

var credentialsConstructor = require('./config/credentials.js');
//const usedCredHere = credentialsConstructor.getWorkspaceCredentials("conversation-simple-example");
const usedCredHere = credentialsConstructor.getWorkspaceCredentials("bluehack");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var conversationJson = {};

var conversation_id = "";
var w_conversation = watson.conversation({
    url: 'https://gateway.watsonplatform.net/conversation/api',
    username: usedCredHere.username,
    password: usedCredHere.password,
    version: 'v1',
    version_date: '2016-07-11'
});
var workspace = usedCredHere.WorkspaceID;

app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'tokenDeVerificacaoFacebook') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Erro de validação no token.');
});

app.post('/webhook/', function (req, res) {
	var text = null;

    messaging_events = req.body.entry[0].messaging;
	for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;

        if (event.message && event.message.text) {
			text = event.message.text;
		}else if (event.postback && !text) {
			text = event.postback.payload;
		}else{
			break;
		}

		var params = {
			input: text,
			context: {"conversation_id": conversation_id}
		}

		var payload = {
			workspace_id: workspace
		};

		if (params) {
			if (params.input) {
				params.input = params.input.replace("\n","");
				payload.input = { "text": params.input };
			}
			if (params.context) {
				payload.context = params.context;
			}
		}
		callWatson(payload, sender);
    }
    res.sendStatus(200);
});
var end = false;
function callWatson(payload, sender) {
	w_conversation.message(payload, function (err, convResults) {
        if (err) {
            return responseToRequest.send("Erro.");
        }

		if(convResults.context != null){
    	conversation_id = convResults.context.conversation_id;

      if(convResults.context.action === 'marcar-medico'){
        conversationJson.medico = convResults.context.medico;
      }
      if(convResults.context.action === 'set-bairro'){
        conversationJson.bairro = convResults.context.bairro;
      }
      if(convResults.context.action === 'set-plano'){
        conversationJson.plano = convResults.context.plano;
      }
      if(convResults.context.action === 'set-inicio'){
        var dataromana = "";
        var hora = "";
        var atArray = convResults.context.data.split(" at ");
        hora = atArray[1];
        var dataarray = atArray[0].split("-");
        var dia = dataarray[2];
        var mes = dataarray[1];
        var ano = dataarray[0];
        dataromana += dia+"/"+mes+"/"+ano;
        conversationJson.data = dataromana + "-" + hora;
      }
      if(convResults.context.action === 'set-cpf'){
        conversationJson.cpf = convResults.context.cpf;
        end = true;
      }

      console.log("conversationJson: ", conversationJson);

      if(convResults != null && convResults.output != null){
  			var i = 0;
  			while(i < convResults.output.text.length){
  				sendMessage(sender, convResults.output.text[i++] + "\n" + JSON.stringify(conversationJson) );
  			}
        if(end){
          console.log("Send to BackEnd");
        }
		  }
    }

    });
}

function sendMessage(sender, text_) {
	text_ = text_.substring(0, 319);
	messageData = {	text: text_ };

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

var token = "EAASR0eAjHecBAPVDXOJXDkKV3BiUOcQ0FNJuyQBkNyyDZBN55xCgadAqbzUbg6wemQIKhAT9eBqlApodgjLSMGSx6X7V5EkgqynAaWO8S4YIOjjy9YGuqvpNMUbCdgJ4cWE5bFK6M16iuGh49kn0bQqg01dziZA0NykvYINAZDZD";
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 3000);
app.listen(port, host);
