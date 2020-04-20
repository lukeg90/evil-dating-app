import React, { useState, useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector, useDispatch } from "react-redux";
import { receiveConnectionsWannabes } from "./actions";

export default function Chat({ show, setShow, userId }) {
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
        if (selectedConnection) {
            setSelectedConnection("");
        } else {
            setShow(false);
        }
    };

    const handleChatConnectionsClick = e => {
        e.stopPropagation();
        setSelectedConnection("");
    };

    const handleChatCardClick = (e, id) => {
        e.stopPropagation();
        setSelectedConnection(id);
    };

    return (
        <div
            className={`chatOverlay ${show ? "on" : ""}`}
            onClick={() => handleOverlayClick()}
        >
            <div
                className={`chatConnections ${show ? "animate" : ""}`}
                onClick={e => handleChatConnectionsClick(e)}
            >
                {connections &&
                    // render online and offline connections separately?
                    connections.map(connection => (
                        <div
                            className="chatConnectionCard"
                            key={connection.id}
                            onClick={e => handleChatCardClick(e, connection.id)}
                        >
                            <img src={connection.image_url} />
                            <span>{connection.first}</span>
                            <span
                                className={
                                    connection.online ? "online" : "offline"
                                }
                            ></span>
                        </div>
                    ))}
            </div>
            <div
                className={`chatContainer ${
                    selectedConnection ? "animate-two" : ""
                }`}
                onClick={e => e.stopPropagation()}
            >
                <div className="chatMessagesContainer" ref={elemRef}>
                    {privateMessages &&
                        privateMessages.map((message, index, array) => {
                            return (
                                <React.Fragment key={message.id}>
                                    {(index == 0 ||
                                        message.date !=
                                            array[index - 1].date) && (
                                        <div className="chatDate">
                                            <p>{message.date}</p>
                                        </div>
                                    )}
                                    <div
                                        className={`chatMessage ${
                                            message.sender_id == userId
                                                ? "myMessage"
                                                : "theirMessage"
                                        }`}
                                    >
                                        {message.receiver_id == userId && (
                                            <img src={message.image_url} />
                                        )}
                                        <div className="chatBubble">
                                            <p>{message.message}</p>
                                            <span className="timestamp">
                                                {message.sent_at}
                                            </span>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                </div>
                <textarea
                    className="enterChatMessage"
                    placeholder="Add your message here"
                    onKeyDown={e => keyCheck(e)}
                />
            </div>
        </div>
    );
}
