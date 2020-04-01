import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./register";
import Login from "./login";

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <HashRouter>
                <div>
                    <div className="welcome-logo">
                        <img src="corona-love.png" />
                        <h1>IN THE TIME OF CORONA</h1>
                    </div>
                    <div>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                    </div>
                </div>
            </HashRouter>
        );
    }
}
