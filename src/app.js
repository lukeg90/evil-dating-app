import React from "react";
import axios from "./axios";
import ProfilePic from "./profile-pic";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            this.setState(data);
            console.log("Current user: ", this.state.first);
        });
    }
    render() {
        return (
            <div>
                <img className="nav-logo" src="corona-love.png"></img>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    imgUrl={this.state.imgUrl}
                />
            </div>
        );
    }
}
