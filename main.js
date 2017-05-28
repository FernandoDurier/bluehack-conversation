var Q = require('q');
// Examples
var prompt = require('prompt-sync')(); //opens console for user inputs.
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

// Start conversation with empty message.
conversation.message({}, processResponse);

function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }

  var endConversation = false;

  // Check for action flags.
  if (response.output.action === 'display_time') {
    // User asked what time it is, so we output the local system time.
    console.log('The current time is ' + new Date().toLocaleTimeString());
  }
  else if (response.output.action === 'end_conversation') {
    // User said goodbye, so we're done.
    console.log(response.output.text[0]);
    endConversation = true;
  }
  else if(response.output.action === 'marcar-medico'){
    console.log(response.output.text[0]);
    console.log("tipo: ", response.output.tipo);
  }
  else {
    // Display the output from dialog, if any.
    if (response.output.text.length != 0) {
        console.log(response.output.text[0]);
    }
  }

  // If we're not done, prompt for the next round of input.
  if (!endConversation) {
    var newMessageFromUser = prompt('>> ');
    conversation.message({
      input: { text: newMessageFromUser },
      // Send back the context to maintain state.
      context : response.context,
    }, processResponse)
  }
}
