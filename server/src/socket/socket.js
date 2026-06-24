import {Server} from 'socket.io';
import {resetUnReadCount} from '../redis/repositories/unreadAndSeenRepository.js';
import {updateMessageStatus} from '../redis/repositories/messageRepository.js';
import { setUserPresence } from '../redis/repositories/presenceRepository.js';

let io;
// export let chatKey;

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
            // chatKey = roomId;
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        })

        socket.on('joinUser', async (userId) => {
            socket.userId = userId; // Store userId in socket object for later use
            console.log("join user event received for userId: ", userId);
            socket.join(userId);
            await setUserPresence(userId, true)
            io.emit("userOnline", userId );
            console.log(`User ${socket.id} joined user room ${userId}`);
        })

        socket.on('disconnect',async () => {
            const userId = socket.userId;
            await setUserPresence(userId, false);
            io.emit("userOffline", userId );
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

        socket.on("messageEdited", (data) => {

            io.to(data.receiverId).emit("messageEdited", data);
        })

    })
}

export function getIO() {
    return io;
}