import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveConnectionsWannabes,
    acceptFriendRequest,
    unfriend
} from "./actions";
import ConnectionList from "./connection-list";

export default function Connections({ authorize }) {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("dispatching receive action on mount");
        dispatch(receiveConnectionsWannabes());
    }, []);

    const connections = useSelector(
        state =>
            state.connections &&
            state.connections.filter(connection => connection.accepted === true)
    );
    const wannabes = useSelector(
        state =>
            state.connections &&
            state.connections.filter(
                connection => connection.accepted === false
            )
    );

    return (
        <React.Fragment>
            <h2>People who want to connect with you:</h2>
            {wannabes && wannabes.length > 0 ? (
                <div className="wannabes">
                    <ConnectionList
                        users={wannabes}
                        authorize={() => authorize()}
                        buttonText={"Accept connection"}
                        handleClick={acceptFriendRequest}
                    />
                </div>
            ) : (
                <h3>None</h3>
            )}
            <h2>Your current connections:</h2>
            {connections && connections.length > 0 ? (
                <div className="connections">
                    <ConnectionList
                        users={connections}
                        authorize={() => authorize()}
                        buttonText={"Remove connection"}
                        handleClick={unfriend}
                    />
                </div>
            ) : (
                <h3>None</h3>
            )}
        </React.Fragment>
    );
}
