import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log("Registration error: ", err);
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
            <div className="registration">
                {this.state.error && (
                    <div className="error">Oops! Something went wrong.</div>
                )}
                <input
                    name="first"
                    type="text"
                    placeholder="First name"
                    onChange={e => this.handleChange(e)}
                />
                <br />
                <input
                    name="last"
                    type="text"
                    placeholder="Last name"
                    onChange={e => this.handleChange(e)}
                />
                <br />
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
                <button onClick={() => this.submit()}>Register</button>
                <p>
                    Already a member? <Link to="/login">Log in</Link>
                </p>
                <p>
                    <Link to="/about">About us</Link>
                </p>
            </div>
        );
    }
}
