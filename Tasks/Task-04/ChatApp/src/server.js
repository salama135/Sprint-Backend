var express = require('express');
var bodyParser = require('body-parser');
var Pusher = require('pusher');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var pusher = new Pusher({ appId: "1259709", key: "7a16ed52da8b5a109d8f", secret: "31b068419804e6a5db41", cluster: "eu" });

app.post('/message', function(req, res) {
    var body = req.body;
    console.log(body);
    console.log(body.groupname);
    console.log(body.message);
    console.log(body.sender);
    pusher.trigger(body.groupname, 'message-added', { sender: body.sender, message: body.message });
    res.sendStatus(200);
});

app.get('/', function(req, res) {
    res.sendFile('/public/index.html', { root: __dirname });
});

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log(`app listening on port ${port}!`)
});