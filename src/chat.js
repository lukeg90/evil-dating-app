import React, { useState, useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector, useDispatch } from "react-redux";
import { receiveConnectionsWannabes } from "./actions";

export default function Chat({ show, setShow }) {
    // want list of all connections to select from
    // after user clicks a connection, chat window should open
    const dispatch = useDispatch();
    const elemRef = useRef();

    const [selectedConnection, setSelectedConnection] = useState();

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

    useEffect(() => {
        console.log("dispatching receive action on mount");
        dispatch(receiveConnectionsWannabes());
        // animate chat container
    }, []);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [privateMessages]);

    const keyCheck = e => {
        if (e.key == "Enter") {
            e.preventDefault();
            console.log("Message: ", e.target.value);
            const dataToEmit = {
                message: e.target.value,
                receiver: selectedConnection
            };
            socket.emit("newPrivateMessage", dataToEmit);
            e.target.value = "";
        }
    };

    const handleOverlayClick = () => {
        setShow(false);
    };

    return (
        <div
            className={`chatOverlay ${show ? "on" : ""}`}
            onClick={() => handleOverlayClick()}
        >
            <div
                className={`chatConnections ${show ? "animate" : ""}`}
                onClick={e => e.stopPropagation()}
            >
                {connections &&
                    connections.map(connection => (
                        <div
                            className="chatConnectionCard"
                            key={connection.id}
                            onClick={() => setSelectedConnection(connection.id)}
                        >
                            <img src={connection.image_url} />
                            <span>{connection.first}</span>
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
                {selectedConnection && (
                    <textarea
                        className="enterChatMessage"
                        placeholder="Add your message here"
                        onKeyDown={e => keyCheck(e)}
                    />
                )}
            </div>
        </div>
    );
}
