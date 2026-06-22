import {Server} from 'socket.io';
import {resetUnReadCount} from '../redis/repositories/unreadAndSeenRepository.js';
import {updateMessageStatus} from '../redis/repositories/messageRepository.js';

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

        socket.on('conversationOpened', async (data) => {
            console.log("message seen status received: ",data);
            const {messageId, senderId, receiverId, status} = data;
            console.log("message seen status received: ", status);
            // await markAllMessageSeen(senderId, receiverId);
            await updateMessageStatus(messageId, status);
            await resetUnReadCount(senderId, receiverId);
            io.to(senderId).emit('messageStatusUpdated', {messageId, status});
        })

        socket.on("typing", (data) => {
            console.log("typing event received: ", data);
            const {senderId, receiverId} = data;
            io.to(receiverId).emit("userTyping", {senderId});
        });

        socket.on("stopTyping", (data) => {
            console.log("stop typing event received: ", data);
            const {senderId, receiverId} = data;
            io.to(receiverId).emit("userStopTyping", {senderId});
        });
    })
}

export function getIO() {
    return io;
}