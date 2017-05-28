//watson conversations' available workspaces
const workspaces = [
  {
    "WorkspaceName":"conversation-simple-example",
    "WorkspaceID": "f1bc47a6-e99c-40a4-bd91-00136569af4d"
  },
  {
    "WorkspaceName":"bluehack",
    "WorkspaceID": "b3fc2204-c7a1-44da-b7a3-681382a48f28"
  }
];

//bluemix service credentials
//watson conversation
const serviceCredentials = {
  "url": "https://gateway.watsonplatform.net/conversation/api",
  "username": "19b55b57-fe79-409b-ae3e-f5b7a37df407",
  "password": "OzjWX7FZKWaU"
}

exports.getWorkspaceCredentials = function(name){
    var credson ={};
    credson.WorkspaceName = workspaces.find(workspace => workspace.WorkspaceName === name).WorkspaceName;
    credson.WorkspaceID = workspaces.find(workspace => workspace.WorkspaceName === name).WorkspaceID;
    credson.url = serviceCredentials.url;
    credson.username = serviceCredentials.username;
    credson.password = serviceCredentials.password;
    return credson;
}
