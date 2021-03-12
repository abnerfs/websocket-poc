import express from 'express';
import socket from 'socket.io';
import http from 'http';


const app = express();
app.use(express.static(__dirname + '/../public'));


const PORT = process.env.PORT || 8899;

app.get('/teste', (req, res) => {
    const msg = req.query.msg?.toString() || '';

    for(const client of clients) {
        client.emit('msg', msg);
    }

    res.json({
        ok: true,
        msg
    });
})

const httpServer = http.createServer(app);
const io = socket(httpServer, {
    path: '/socket.io'
})

const clients : Array<any> = [];


io.on('connection', (client: socket.Socket) => {
    client.on('join', (params: string) => {
        clients.push(client);
        console.log(`Joined: ${client.id} ${params}`);
    });

    client.on('disconnect', () => {
        clients.splice(clients.indexOf(client), 1);
        console.log(`Disconnected: ${client.id}`);
    })
})



httpServer.listen(PORT, () => {
    console.log('Server http started at ' + PORT);
});