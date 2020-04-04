import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            beingEdited: false
        };
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }
    editBio() {
        this.setState({
            beingEdited: true,
            updatedBio: this.props.bio
        });
    }
    updateBio() {
        axios
            .post("/user/profile/bio", { bio: this.state.updatedBio })
            .then(({ data }) => {
                if (data.success) {
                    console.log("Bio updated successfully: ", data);
                    this.props.setBio(data.bio);
                    this.setState({ beingEdited: false });
                } else {
                    console.log("Error updating bio");
                    this.setState({ error: true });
                }
            });
    }
    getCurrentDisplay() {
        if (this.state.beingEdited) {
            // display text area with Save button
            return (
                <div className="bio-text">
                    <textarea
                        name="updatedBio"
                        value={this.state.updatedBio}
                        onChange={e => this.handleChange(e)}
                    />
                    <br />
                    <button onClick={() => this.updateBio()}>Save</button>
                </div>
            );
        } else if (this.props.bio) {
            // if there is already saved bio
            // current bio text and Edit button
            return (
                <div>
                    <h3>{this.props.bio}</h3>
                    <button onClick={() => this.editBio()}>Edit bio</button>
                </div>
            );
            // else
            // Add button
        } else {
            return (
                <div>
                    <button onClick={() => this.editBio()}>Add a bio</button>
                </div>
            );
        }
    }
    render() {
        return (
            <React.Fragment>
                {this.state.error && (
                    <div className="error">Oops, something went wrong</div>
                )}
                {this.getCurrentDisplay()}
            </React.Fragment>
        );
    }
}
