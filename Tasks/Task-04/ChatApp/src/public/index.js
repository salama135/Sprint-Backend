import * as DATA from './data.js';

$(document).ready(function() {
    $("#chat_div").hide()

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var pusher = new Pusher('7a16ed52da8b5a109d8f', {
        cluster: 'eu',
        encrypted: false
    });

    var channel = pusher.subscribe('public-chat');
    channel.bind('message-added', onMessageAdded);

    $('#btn-chat').click(function() {
        const content = $("#message").val();
        $("#message").val("");

        let new_message = new DATA.Message(content, DATA.CurrentUser.id);
        DATA.CurrentGroup.messages.push(new_message);

        let req = { sender: new_message.sender_id, message: new_message.message, groupname: DATA.CurrentGroup.name };
        console.log(req);

        //send message
        $.post("http://localhost:5000/message", req);

        //send message
        //$.post("http://localhost:5000/message", { content: message });
    });

    function onMessageAdded(data) {

        let template_not_you = $("#new-message-other-not-you").html();
        template_not_you = template_not_you.replace("{{body}}", data.message);
        template_not_you = template_not_you.replace("{{chars}}", "aa");

        let template_you = $("#new-message-other-you").html();
        template_you = template_you.replace("{{body}}", data.message);
        template_you = template_you.replace("{{chars}}", "bb");

        $(".chat").append(template_not_you);
        $(".chat").append(template_you);
    }

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
            let group = new DATA.Group(groupname)
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

        channel.bind("pusher:subscription_succeeded", (members) => {
            // For example
            update_member_count(members.count);

            members.each((member) => {
                // For example
                add_member(member.id, member.info);
            });
        });
    });

    $('#logout').click(function() {
        pusher.unsubscribe(DATA.CurrentGroup.name);

        DATA.SetCurrentUser(null);
        DATA.SetCurrentGroup(null);

        $("#chat_div").hide();
        $("#join_div").show();
    });

});