import {redisSubscriber} from '../redis/redisClient.js';
import {getIO} from '../socket/socket.js';

redisSubscriber.subscribe('chat_channel', (err, count) => {
    if(err) {
        console.log("error during subscribing to channel", err);
    }
})

redisSubscriber.on('message', (channel, message) => {
    const event = JSON.parse(message);

    switch(event.type){
        case 'NEW_MESSAGE': {
            const messageData = event.data;

            const io = getIO();
            const roomId = [messageData.senderId, messageData.receiverId].sort().join(':');
            io.to(roomId).emit('newMessage', messageData);
            console.log("Message emitted to room", roomId);
            break;
        }
        // case 'MESSAGE_EDITED' : {
        //     const messageData = event.data;

        //     const io = getIO();
        //     const roomId = [messageData.senderId, messageData.receiverId].sort().join(':');
        //     io.to(roomId).emit('messageEdited', messageData);
        //     console.log("Message edited emitted to room", roomId);
        //     break;
        // }
        // case 'MESSAGE_DELIVERED': {
        //     const messageData = event.data;

        //     const io = getIO();
        //     const roomId = 
        // }
        default:
            console.log("Unknown event type received:", event.type);
    }

})