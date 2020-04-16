import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector(
        state => state.chatMessages && state.chatMessages
    );

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        console.log("Chat messages: ", chatMessages);
    }, [chatMessages]);

    const keyCheck = e => {
        if (e.key == "Enter") {
            e.preventDefault();
            console.log("Message: ", e.target.value);
            socket.emit("My amazing new chat message", e.target.value);
            e.target.value = "";
        }
    };
    return (
        <div>
            <h2>To hell with matches, chat with everyone!</h2>
            <div className="chatMessagesContainer" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map(chatMessage => (
                        <div key={chatMessage.id} className="chatMessage">
                            <img src={chatMessage.image_url} />
                            <div className="chatText">
                                <h4>
                                    {chatMessage.first}{" "}
                                    <span>{chatMessage.sent_at}</span>
                                </h4>
                                <p>{chatMessage.message}</p>
                            </div>
                        </div>
                    ))}
            </div>
            <textarea
                className="enterChatMessage"
                placeholder="Add your message here"
                onKeyDown={e => keyCheck(e)}
            />
        </div>
    );
}
