const https = require('http');
const fs = require("fs");
const WebSocketServer = require('ws').Server;

const wsPort = 8080;

const httpsServer = https.createServer({
    key: fs.readFileSync('key.pem', 'utf8'),
    cert: fs.readFileSync('cert.pem', 'utf8')
}).listen(wsPort);

const wss = new WebSocketServer({ server: httpsServer });

wss.on('connection', function(ws, req) {
    let connectionId = req.headers['sec-websocket-key'];

    ws.on('message', function(message) {
        console.log(message)
        // send data to --> Vosk API //Google Speech API // CommonVoice // ...
        // --> gives text back (transcription)
    });
    console.log('Speaker connected');
});

wss.on('close', function() {
    console.log('Speaker disconnected');
});

console.log('Listening on port:', wsPort);
