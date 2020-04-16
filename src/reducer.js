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
    if (action.type == "RECEIVE_CHAT_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.msgs
        };
    }
    if (action.type == "ADD_CHAT_MESSAGE") {
        const chatMessages = [...state.chatMessages, action.msg];
        state = { ...state, chatMessages };
    }
    console.log("State in reducer: ", state);
    return state;
}
