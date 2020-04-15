export default function(state = {}, action) {
    if (action.type == "RECEIVE_CONNECTIONS_WANNABES") {
        state = { ...state, connections: action.connectionsWannabes };
    }
    console.log("State in reducer: ", state);
    return state;
}
