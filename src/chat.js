import React, { useState, useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector, useDispatch } from "react-redux";
import { receiveConnectionsWannabes } from "./actions";

export default function Chat() {
    // want list of all connections to select from
    // after user clicks a connection, chat window should open up on the right
    const dispatch = useDispatch();
    const elemRef = useRef();

    const [selectedConnection, setSelectedConnection] = useState();

    useEffect(() => {
        console.log("dispatching receive action on mount");
        dispatch(receiveConnectionsWannabes());
    }, []);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [privateMessages]);

    const keyCheck = e => {
        if (e.key == "Enter") {
            e.preventDefault();
            console.log("Message: ", e.target.value);
            socket.emit("newPrivateMessage", e.target.value);
            e.target.value = "";
        }
    };

    const connections = useSelector(
        state =>
            state.connections &&
            state.connections.filter(connection => connection.accepted === true)
    );

    const privateMessages = useSelector(
        state =>
            state.privateMessages &&
            state.privateMessages.filter(
                message =>
                    message.sender_id === selectedConnection ||
                    message.receiver_id === selectedConnection
            )
    );

    return (
        <React.Fragment>
            <h1>Select one of your connections to chat with:</h1>
            <div className="connections">
                {connections &&
                    connections.map(connection => (
                        <div
                            className="userCard"
                            key={connection.id}
                            onClick={() => setSelectedConnection(connection.id)}
                        >
                            <img src={connection.image_url} />
                            <h4>{connection.first}</h4>
                        </div>
                    ))}
            </div>
            <div className="chatMessagesContainer" ref={elemRef}>
                {privateMessages &&
                    privateMessages.map(message => (
                        <div key={message.id} className="chatMessage">
                            <img src={message.image_url} />
                            <div className="chatText">
                                <h4>
                                    {message.first}{" "}
                                    <span>{message.sent_at}</span>
                                </h4>
                                <p>{message.message}</p>
                            </div>
                        </div>
                    ))}
                <textarea
                    className="enterChatMessage"
                    placeholder="Add your message here"
                    onKeyDown={e => keyCheck(e)}
                />
            </div>
        </React.Fragment>
    );
}
