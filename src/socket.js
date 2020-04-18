import * as io from "socket.io-client";
import { privateMessages, addPm } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("privateMessages", msgs => {
            console.log("Private messages in the client: ", msgs);
            store.dispatch(privateMessages(msgs));
        });

        socket.on("addPm", msg => {
            console.log("Added private message: ", msg);
            store.dispatch(addPm(msg));
        });
    }
};
