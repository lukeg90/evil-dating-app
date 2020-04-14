import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveConnectionsWannabes } from "./actions";

export default function Connections() {
    const dispatch = useDispatch();
    const connections = useSelector(state =>
        state.connections.filter(connection => connection.accepted == true)
    );
    const wannabes = useSelector(state =>
        state.connections.filter(connection => connection.accepted == false)
    );

    useEffect(() => {
        dispatch(receiveConnectionsWannabes);
    }, []);

    console.log("Connections: ", connections);
    console.log("Wannabes: ", wannabes);
}
