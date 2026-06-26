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

});

redisSubscriber.subscribe('group_chat_channel', (err, count) => {
    if(err) {
        console.log("error during subscribing to group channel", err);
    }
})

redisSubscriber.on('message', (channel, message) => {
    const event = JSON.parse(message);

    switch(event.type){
        case 'NEW_GROUP_MESSAGE': {
            const messageData = event.data;
            const io = getIO();

            const groupRoomId = `group:${messageData.groupId}`;
            io.to(groupRoomId).emit('newGroupMessage', messageData);
            console.log("Group Message emitted to room", groupRoomId);
            break;
        }
        default:
            console.log("Unknown event type received:", event.type);
    }
})