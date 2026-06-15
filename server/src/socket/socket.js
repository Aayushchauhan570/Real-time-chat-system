import {Server} from 'socket.io';
import {resetUnReadCount, updateMessageStatus} from '../redis/redisHelper.js';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    })

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        })

        socket.on('joinUser', (userId) => {
            socket.join(userId);
            console.log(`User ${socket.id} joined user room ${userId}`);
        })

        socket.on('disconnect',() => {
            console.log('user disconnected');
        })

        socket.on('messageDelivered',async (data) => {
            const {messageId, status, senderId, receiverId} = data;
            await updateMessageStatus(messageId, status);
            io.to(senderId).emit('messageStatusUpdated', {messageId, status});
            // io.to(receiverId).emit('messageStatusUpdated', {messageId, status});
        })

        socket.on('messageSeen', async (data) => {
            // console.log("message seen status received: ",data);
            const {messageId, status, senderId, receiverId} = data;
            await updateMessageStatus(messageId, status);
            await resetUnReadCount(senderId, receiverId);
            io.to(senderId).emit('messageStatusUpdated', {messageId, status});
        })
    })
}

export function getIO() {
    return io;
}