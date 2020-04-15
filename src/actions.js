import axios from "./axios";

export async function receiveConnectionsWannabes() {
    const { data } = await axios.get("/connections-wannabes");
    console.log("Connections in action: ", data);
    if (data.success) {
        return {
            type: "RECEIVE_CONNECTIONS_WANNABES",
            connectionsWannabes: data.connectionsWannabes
        };
    } else {
        console.log("Error requesting connections from server");
    }
}

export async function acceptFriendRequest(id) {
    const { data } = await axios.post(`/add-friendship/${id}`);
    if (data.success) {
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            id
        };
    } else {
        console.log("Error in accept friend request action");
    }
}

export async function unfriend(id) {
    const { data } = await axios.post(`/end-friendship/${id}`);
    if (data.succes) {
        return {
            type: "UNFRIEND",
            id
        };
    }
}
