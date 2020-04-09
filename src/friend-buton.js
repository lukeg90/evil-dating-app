import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton({ otherUserId }) {
    const [buttonText, setButtonText] = useState("Send Friend Request");
    const [error, setError] = useState(false);

    useEffect(() => {
        // make axios request to determine initial status of friendship
        console.log("Other user ID: ", otherUserId);
        axios
            .get(`/initial-friendship-status/${otherUserId}`)
            .then(({ data }) => {
                if (data.success) {
                    console.log("Successfully determined state of friendship");
                    if (data.accepted) {
                        setButtonText("End Friendship");
                    } else if (data.awaitingUserAction) {
                        setButtonText("Accept Friend Request");
                    } else if (data.awaitingOtherAction) {
                        setButtonText("Cancel Friend Request");
                    }
                } else {
                    console.log("No current friendship status");
                    setButtonText("Send Friend Request");
                }
            });
    }, []);
    const handleClick = () => {
        if (buttonText == "Send Friend Request") {
            axios
                .post(`/make-friend-request/${otherUserId}`)
                .then(({ data }) => {
                    if (data.success) {
                        setButtonText("Cancel Friend Request");
                    } else {
                        setError(true);
                    }
                });
        } else if (buttonText == "Accept Friend Request") {
            axios.post(`/add-friendship/${otherUserId}`).then(({ data }) => {
                if (data.success) {
                    setButtonText("End Friendship");
                } else {
                    setError(true);
                }
            });
        } else {
            axios.post(`/end-friendship/${otherUserId}`).then(({ data }) => {
                if (data.success) {
                    setButtonText("Send Friend Request");
                } else {
                    setError(true);
                }
            });
        }
    };
    return (
        <React.Fragment>
            <button className="friendButton" onClick={handleClick}>
                {buttonText}
            </button>
            {error && <h3 className="error">Oops, there was an error</h3>}
        </React.Fragment>
    );
}
