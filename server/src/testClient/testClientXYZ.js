import { io } from "socket.io-client";
import readline from "readline";

const socket = io("http://localhost:5002");
const currentUser = "xyz"; // Replace with the actual current user ID

socket.on("connect", () => {
    console.log("Connected:", socket.id);

    // Join conversation room
    socket.emit("joinRoom", "123:xyz");
    socket.emit("joinUser", "xyz");
    console.log("Joined user room xyz");
    console.log("Joined room 123:xyz");


});

socket.on("newMessage", (message) => {
    // if(message.receiverId !== currentUser) {
    //     console.log(`Message received for user ${message.receiverId}, but current user is ${currentUser}. Ignoring.`);
    //     return;
    // }

    // if(message.senderId === currentUser) {
    //     console.log(`Message sent by current user ${currentUser}. Ignoring.`);
    //     return;
    // }
    if (message.receiverId === currentUser) {
        console.log("\n📩 New Message Received:");
        console.log(message);
        socket.emit('messageDelivered', { messageId: message.id, senderId: message.senderId, status: 'delivered' });

        setTimeout(() => {
            socket.emit('conversationOpened', { messageId: message.id, senderId: message.senderId, receiverId: message.receiverId, status: 'seen' });
        }, 5000);
    }

});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("line", () => {
    socket.emit("typing", {
        senderId: "xyz",
        receiverId: "123",
        // conversationId: "123:xyz"
    });
});

socket.emit("stopTyping", {
        senderId: "xyz",
        receiverId: "123"
    });

// rl.pause();

socket.on("userStopTyping", (data) => {
    console.log(data);
    console.log(`\n💬 ${data.senderId} stopped typing.`);
});

socket.on("userOnline", (data) => {
    console.log(`${data} is online.`)
})

socket.on("userOffline", (data) => {
    console.log(`${data} goes offline.`)
})

socket.on('messageStatusUpdated', (data) => {
    console.log("\n✅ Message Status Updated:");
    console.log(data);
})


socket.on("userTyping", (data) => {
    console.log(data);
    console.log(`\n💬 ${data.senderId} is typing...`);
});

socket.on("messageEdited", (data) => {
    console.log("\n✏️ Message Edited:");
    console.log(data);
})

socket.on("messageDeleted", (data) => {
    console.log("\n🗑️ Message Deleted:");
    console.log(data);
})


socket.on("disconnect", () => {
    console.log("Disconnected");
});