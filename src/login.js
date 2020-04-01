import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                        errorMessage: data.error
                    });
                }
            })
            .catch(err => {
                console.log("Login error: ", err);
                this.setState({
                    error: true
                });
            });
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }
    render() {
        return (
            <div className="login">
                {this.state.error && (
                    <div className="error">
                        Oops, something went wrong. {this.state.errorMessage}
                    </div>
                )}
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={e => this.handleChange(e)}
                />
                <br />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={e => this.handleChange(e)}
                />
                <br />
                <button onClick={() => this.submit()}>Log in</button>
            </div>
        );
    }
}
