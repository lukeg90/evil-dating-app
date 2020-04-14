import axios from "./axios";

export async function receiveConnectionsWannabes() {
    const { data } = await axios.get("/connections-wannabes");
    console.log("Connections: ", data);
    return {
        type: "RECEIVE_CONNECTIONS_WANNABES",
        connectionsWannabes: data.connectionsWannabes
    };
}
