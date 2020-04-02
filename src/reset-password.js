import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("reset password component mounted");
        this.setState({
            step: "first"
        });
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }
    getCurrentDisplay() {
        const step = this.state.step;
        if (step == "first") {
            return (
                <div>
                    <h4>Please enter the email address you used to register</h4>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        key="email"
                        required
                        onChange={e => this.handleChange(e)}
                    ></input>
                    <br />
                    <button onClick={() => this.submitEmail()}>Submit</button>
                </div>
            );
        } else if (step == "second") {
            return (
                <div>
                    <h4>Please enter the code you received</h4>
                    <input
                        name="code"
                        type="text"
                        placeholder="Code"
                        key="code"
                        required
                        onChange={e => this.handleChange(e)}
                    />
                    <br />
                    <h4>Please enter a new password</h4>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        onChange={e => this.handleChange(e)}
                    />
                    <br />
                    <button onClick={() => this.submitCodeAndPassword()}>
                        Submit
                    </button>
                </div>
            );
        } else if (step == "third") {
            return (
                <div>
                    <h4>Success!</h4>
                    <p>
                        You can now <Link to="/login">log in</Link> with your
                        new password.
                    </p>
                </div>
            );
        }
    }
    submitEmail() {
        axios
            .post("/password/reset/start", {
                email: this.state.email
            })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        error: false,
                        step: "second"
                    });
                } else {
                    this.setState({
                        error: true,
                        errorMessage: data.error
                    });
                }
            })
            .catch(err => {
                console.log("Error submitting email: ", err);
                this.setState({
                    error: true
                });
            });
    }
    submitCodeAndPassword() {
        axios
            .post("/password/reset/verify", {
                email: this.state.email,
                code: this.state.code,
                newPassword: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        error: false,
                        step: "third"
                    });
                } else {
                    this.setState({
                        error: true,
                        errorMessage: data.error
                    });
                }
            })
            .catch(err => {
                console.log("Error verifying code: ", err);
                this.setState({
                    error: true
                });
            });
    }
    render() {
        return (
            <div className="reset-password">
                {this.state.error && (
                    <div className="error">
                        Oops, something went wrong. {this.state.errorMessage}
                    </div>
                )}
                <h3>Reset Password</h3>
                {this.getCurrentDisplay()}
            </div>
        );
    }
}
