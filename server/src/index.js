import express from 'express';
import 'dotenv/config';
import {createServer} from 'http';
import { initSocket } from './socket/socket.js';
import './subscribers/chatSubscriber.js';
import router from './routes/chatRoute.js';

const app = express();
app.use(express.json());

const server = createServer(app);

initSocket(server);

app.use('/', router);



server.listen(process.env.PORT, ()=> {
    console.log('server is running on port http://localhost:' + process.env.PORT);
})