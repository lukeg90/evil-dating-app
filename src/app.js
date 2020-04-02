import React from "react";
import axios from "./axios";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        // now is the moment to contact the server
        // we will need a new GET route
        // GET will make a db query to get the user info and res.json it back
        // when we have the info, we want to add it to state
    }
    render() {
        return (
            <div>
                <img className="nav-logo" src="corona-love.png"></img>
            </div>
        );
    }
}
