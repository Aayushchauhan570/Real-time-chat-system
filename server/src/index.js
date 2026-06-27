import express from 'express';
import 'dotenv/config';
import {createServer} from 'http';
import { initSocket } from './socket/socket.js';
import './subscribers/chatSubscriber.js';
import router from './routes/chatRoute.js';
import groupRouter from './routes/groupChatRoute.js';

const app = express();
app.use(express.json());
app.use('/', groupRouter); // Use the groupRouter for routes starting with /group
const server = createServer(app);

initSocket(server);

app.use('/', router);



server.listen(process.env.PORT, ()=> {
    console.log('server is running on port http://localhost:' + process.env.PORT);
})