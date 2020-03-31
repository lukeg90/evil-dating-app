import React from "react";
import Registration from "./register";

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <div className="BigLogo">
                    <h1>My Social Network</h1>
                </div>
                <Registration />
            </div>
        );
    }
}
