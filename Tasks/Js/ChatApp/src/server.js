var express = require('express');
var bodyParser = require('body-parser');
var Pusher = require('pusher');
const cors = require("cors");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

var pusher = new Pusher({ appId: "1259709", key: "7a16ed52da8b5a109d8f", secret: "31b068419804e6a5db41", cluster: "eu" });

let groups = new Map();
app.post("/pusher/auth", (req, res) => {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;

    if (groups.has(channel) === false) groups.set(channel, 0);

    const presenceData = {
        user_id: "IDStart",
        user_info: { name: "Mr Channels", twitter_id: "@pusher" },
    };
    const auth = pusher.authenticate(socketId, channel, presenceData);

    res.send(auth);
});

app.post('/message', function(req, res) {
    var body = req.body;
    console.log(body);
    console.log(body.groupname);
    console.log(body.message);
    console.log(body.sender);
    pusher.trigger(body.groupname, 'message-added', { sender: body.sender, message: body.message });
    res.sendStatus(200);
});

app.post('/user', function(req, res) {
    var body = req.body;

    if (body.event === "subscribe") {
        groups.set(body.groupname, groups.get(body.groupname) + 1);
        pusher.trigger(body.groupname, 'user-action', { event: "subscribe", name: body.name, id: groups.get(body.groupname), count: groups.get(body.groupname) });
    } else
    if (body.event === "unsubscribe") {
        groups.set(body.groupname, groups.get(body.groupname) - 1);
        pusher.trigger(body.groupname, 'user-action', { event: "unsubscribe", count: groups.get(body.groupname) });
    }

    res.sendStatus(200);
});

app.get('/', function(req, res) {
    res.sendFile('/public/index.html', { root: __dirname });
});

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log(`app listening on port ${port}!`);
});