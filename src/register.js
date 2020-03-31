import React from "react";
import axios from "axios";

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
            });
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }
    render() {
        return (
            <div>
                {this.state.error && <div className="error">Oops!</div>}
                <input
                    name="first"
                    type="text"
                    placeholder="First name"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="last"
                    type="text"
                    placeholder="Last name"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={e => this.handleChange(e)}
                />
                <button onClick={() => this.submit()}>Register</button>
            </div>
        );
    }
}
