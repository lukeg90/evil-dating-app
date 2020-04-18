export default function(state = {}, action) {
    if (action.type == "RECEIVE_CONNECTIONS_WANNABES") {
        state = { ...state, connections: action.connectionsWannabes };
    }
    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            connections: state.connections.map(connection => {
                if (connection.id === action.id) {
                    return {
                        ...connection,
                        accepted: true
                    };
                } else {
                    return connection;
                }
            })
        };
    }
    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            connections: state.connections.filter(
                connection => connection.id != action.id
            )
        };
    }
    if (action.type == "RECEIVE_PRIVATE_MESSAGES") {
        state = {
            ...state,
            privateMessages: action.msgs
        };
    }

    if (action.type == "ADD_PM") {
        const privateMessages = [...state.privateMessages, action.msg];
        state = { ...state, privateMessages };
    }
    console.log("State in reducer: ", state);
    return state;
}
