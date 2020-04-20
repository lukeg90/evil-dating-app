import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton({ otherUserId }) {
    const [buttonText, setButtonText] = useState("Request Connection");
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
                        setButtonText("End Connection");
                    } else if (data.awaitingUserAction) {
                        setButtonText("Accept Connection Request");
                    } else if (data.awaitingOtherAction) {
                        setButtonText("Cancel Connection Request");
                    }
                } else {
                    console.log("No current friendship status");
                    setButtonText("Request Connection");
                }
            });
    }, []);
    const handleClick = () => {
        if (buttonText == "Request Connection") {
            axios
                .post(`/make-friend-request/${otherUserId}`)
                .then(({ data }) => {
                    if (data.success) {
                        setButtonText("Cancel Connection Request");
                    } else {
                        setError(true);
                    }
                });
        } else if (buttonText == "Accept Connection Request") {
            axios.post(`/add-friendship/${otherUserId}`).then(({ data }) => {
                if (data.success) {
                    setButtonText("End Connection");
                } else {
                    setError(true);
                }
            });
        } else {
            axios.post(`/end-friendship/${otherUserId}`).then(({ data }) => {
                if (data.success) {
                    setButtonText("Request Connection");
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
