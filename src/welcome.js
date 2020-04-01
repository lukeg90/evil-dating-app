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
                <div className="welcome-logo">
                    <img src="corona-love.png" />
                    <h1>IN THE TIME OF CORONA</h1>
                </div>
                <Registration />
            </div>
        );
    }
}
