var connection = new signalR.HubConnectionBuilder().withUrl("/service").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (type, message) {
    var msg, encodedMsg;
    switch (type) {
        case 'Connection':  
        case 'DisConnection': 
        case 'DisConnection': { receiveConnection(type, message); break; }
        default: {
            msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            encodedMsg = type + " says " + msg;

            var li = document.createElement("li");
            li.textContent = encodedMsg;
            document.getElementById("messagesList").appendChild(li);
        }
    }
});

function receiveConnection(type, message) {
    var li = document.createElement("li");
    li.textContent = type + " : " + message;;
    document.getElementById("messagesList").appendChild(li);
}


connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;

    connection.invoke("SendMessage", 'Connection', connection.connectionId).catch(function (err) {
        return console.error(err);
    });
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("sendButton2").addEventListener("click", function (event) {
    var user = document.getElementById("userInput2").value;
    var message = document.getElementById("messageInput2").value;
    connection.invoke("SendMessageToUser", user, 'SendToUser', message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});