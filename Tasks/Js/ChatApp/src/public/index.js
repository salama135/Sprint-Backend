import * as DATA from './data.js';

$(document).ready(function() {

    // TODO Local Storage 

    if (DATA.CurrentUser === null)

        $("#chat_div").hide();

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var pusher = new Pusher('7a16ed52da8b5a109d8f', {
        cluster: 'eu',
        encrypted: false
    });

    $('#btn-chat').click(function() {
        const content = $("#message").val();
        $("#message").val("");

        let new_message = new DATA.Message(content, DATA.CurrentUser.id);
        DATA.CurrentGroup.messages.push(new_message);

        let req = { sender: new_message.sender_id, message: new_message.message, groupname: DATA.CurrentGroup.name };
        // console.log("req", req);

        //send message
        $.post("http://localhost:5000/message", req);

        //send message
        //$.post("http://localhost:5000/message", { content: message });
    });

    $('#btn-join').click(function() {
        const username = $("#username").val();
        $("#username").val("");

        if (DATA.InputIsValid(username) === false) return;

        const groupname = $("#groupname").val();
        $("#groupname").val("");

        if (DATA.InputIsValid(groupname) === false) return;

        if (DATA.CheckUserExists(username) === false) {
            let user = new DATA.User(username, groupname)
            DATA.Users.push(user);
            DATA.SetCurrentUser(user);
        } else {
            let user = DATA.GetUser(username)
            DATA.SetCurrentUser(user);
        }

        if (DATA.CheckGroupExists(groupname) === false) {
            let group = new DATA.Group("presence-" + groupname)
            DATA.Groups.push(group);
            DATA.SetCurrentGroup(group);
        } else {
            let group = DATA.GetGroup(groupname)
            DATA.SetCurrentGroup(group);
        }

        $("#join_div").hide();
        $("#chat_div").show();

        var channel = pusher.subscribe(DATA.CurrentGroup.name);

        channel.bind('message-added', onMessageAdded);

        channel.bind("user-action", (data) => {
            if (data.event === "unsubscribe") {
                pusher.unsubscribe(DATA.CurrentGroup.name);

                DATA.SetCurrentGroup(null);
                DATA.SetCurrentUser(null);

                $("#chat_div").hide();
                $("#join_div").show();
            } else
            if (data.event === "subscribe") {
                DATA.CurrentUser.id = data.id;
            }

            console.log(data);
            $('#counter').text(String(data.count));
        });

        channel.bind('pusher:subscription_succeeded', function() {
            alert('successfully joined!');
        });

        $.post("http://localhost:5000/user", { event: "subscribe", name: DATA.CurrentUser.name, id: DATA.CurrentUser.id, groupname: DATA.CurrentGroup.name });
    });

    function onMessageAdded(data) {
        // console.log("data", data);

        if (parseInt(data.sender) === DATA.CurrentUser.id) {
            let template_you = $("#new-message-other-you").html();
            template_you = template_you.replace("{{body}}", data.message);
            template_you = template_you.replace("{{chars}}", "bb");
            $(".chat").append(template_you);
        } else {
            let template_not_you = $("#new-message-other-not-you").html();
            template_not_you = template_not_you.replace("{{body}}", data.message);
            template_not_you = template_not_you.replace("{{chars}}", "aa");
            $(".chat").append(template_not_you);
        }
    }

    $('#logout').click(function() {
        $.post("http://localhost:5000/user", { event: "unsubscribe", groupname: DATA.CurrentGroup.name });
    });

});