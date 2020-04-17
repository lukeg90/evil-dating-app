import * as io from "socket.io-client";
import { chatMessages, addChatMessage, privateMessages } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        // socket.on("addChatMessage", newMsg => {
        //     console.log(
        //         "I can see my new chat message in the client! The message is: ",
        //         newMsg
        //     );
        // });
        // socket.on("chatMessages", msgs => store.dispatch(chatMessages(msgs)));

        // socket.on("addChatMessage", msg => store.dispatch(addChatMessage(msg)));

        socket.on("privateMessages", msgs => {
            console.log("Private messages in the client: ", msgs);
            store.dispatch(privateMessages(msgs));
        });
    }
};
