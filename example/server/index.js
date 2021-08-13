const https = require('http');
const fs = require("fs");
const WebSocketServer = require('ws').Server;
const { OpusEncoder } = require('@discordjs/opus');

const wsPort = 8080;

const httpsServer = https.createServer({
    key: fs.readFileSync('key.pem', 'utf8'),
    cert: fs.readFileSync('cert.pem', 'utf8')
}).listen(wsPort);

const wss = new WebSocketServer({ server: httpsServer });

const vosk = require('vosk');
vosk.setLogLevel(-1);
// MODELS: https://alphacephei.com/vosk/models
const model = new vosk.Model('vosk-model-fr');
const rec = new vosk.Recognizer({model: model, sampleRate: 24000});
vosk._rec_ = rec;
// dev reference: https://github.com/alphacep/vosk-api/blob/master/nodejs/index.js


wss.on('connection', function(ws, req) {
    // Create the encoder.
    // Specify 24kHz sampling rate and 1 channel size.
    const encoder = new OpusEncoder(24000, 1);

    ws.on('message', function(message) {
        //console.log(message)
        // send data to --> Vosk API //Google Speech API // CommonVoice // ...
        // --> gives text back (transcription)

        // Encode and decode the message before sending to vosk
        const decoded = encoder.decode(message);

        if (vosk._rec_.acceptWaveform(decoded))
            console.log(vosk._rec_.result());
    });
    console.log('Speaker connected');
});

wss.on('close', function() {
    console.log('Speaker disconnected');
});

console.log('Listening on port:', wsPort);
