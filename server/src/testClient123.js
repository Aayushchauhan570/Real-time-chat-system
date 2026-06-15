import { io } from "socket.io-client";

const socket = io("http://localhost:5002");
const currentUser = '123'; // Replace with the actual current user ID

socket.on("connect", () => {
    console.log("Connected:", socket.id);

    // Join conversation room
    socket.emit("joinRoom", "123:xyz");
    socket.emit("joinUser", "123");
    console.log("Joined user room 123");
    console.log("Joined room 123:xyz");


});

socket.on("newMessage", (message) => {
    if (message.receiverId !== currentUser) {
        console.log(`Message received for user ${message.receiverId}, but current user is ${currentUser}. Ignoring.`);
        return;
    }

    if (message.senderId === currentUser) {
        console.log(`Message sent by current user ${currentUser}. Ignoring.`);
        return;
    }


    console.log("\n📩 New Message Received:");
    console.log(message);
    socket.emit('messageDelivered', { messageId: message.id, senderId: message.senderId, status: 'delivered' });

    setTimeout(() => {
        socket.emit('messageSeen', { messageId: message.id, senderId: message.senderId, receiverId: message.receiverId, status: 'seen' });
    }, 20000);
});

socket.on('messageStatusUpdated', (data) => {
    console.log("\n✅ Message Status Updated:");
    console.log(data);
})



socket.on("disconnect", () => {
    console.log("Disconnected");
});