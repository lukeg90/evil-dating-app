import React from "react";
import axios from "./axios";

export default class ProfileEditor extends React.Component {
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
    editProfile() {
        this.setState({
            beingEdited: true,
            updatedProfile: this.props.profile
        });
    }
    updateProfile() {
        axios
            .post("/user/profile/update", {
                profile: this.state.updatedProfile
            })
            .then(({ data }) => {
                if (data.success) {
                    console.log("Profile updated successfully: ", data);
                    this.props.setProfile(data);
                    this.setState({ beingEdited: false });
                } else {
                    console.log("Error updating profile");
                    this.setState({ error: true });
                }
            });
    }
    getCurrentDisplay() {
        if (this.state.beingEdited) {
            // display form for editing profile
            return (
                <div className="editProfile">
                    <label htmlFor="birthday">Date of birth</label>
                    <br />
                    <input
                        type="date"
                        name="birthday"
                        id="birthday"
                        onChange={e => this.handleChange(e)}
                    />
                    <br />
                    <div onChange={e => this.handleChange(e)}>
                        <p>Gender:</p>
                        <label htmlFor="male">Male</label>
                        <input
                            type="radio"
                            name="gender"
                            id="male"
                            value="male"
                        />
                        <label htmlFor="female">Female</label>
                        <input
                            type="radio"
                            name="gender"
                            id="female"
                            value="female"
                        />
                        <label htmlFor="other">Other</label>
                        <input
                            type="radio"
                            name="gender"
                            id="other"
                            value="other"
                        />
                    </div>
                    <div onChange={e => this.handleChange(e)}>
                        <p>Interested in:</p>
                        <label htmlFor="males">Males</label>
                        <input
                            type="radio"
                            name="seeking"
                            id="males"
                            value="males"
                        />
                        <label htmlFor="females">Females</label>
                        <input
                            type="radio"
                            name="seeking"
                            id="females"
                            value="females"
                        />
                        <label htmlFor="others">Others</label>
                        <input
                            type="radio"
                            name="seeking"
                            id="others"
                            value="others"
                        />
                    </div>
                    <input
                        type="text"
                        name="interests"
                        id="interests"
                        placeholder="Add an interest"
                    />
                    <button onClick={}>Add</button>
                    <br />
                    <p>Interests:</p>
                    <select name="symptoms" id="symptoms">
                        <option value="">--Select a symptom--</option>
                        <option value="soreThroat">Sore throat</option>
                        <option value="runnyNose">Runny nose</option>
                        <option value="fever">Fever</option>
                        <option value="cough">Cough</option>
                        <option value="vomiting">Vomiting</option>
                        <option value="bodyAches">Body Aches</option>
                        <option value="Fatigue">Fatigue</option>
                    </select>
                    <button>Add</button>
                    <br />
                    <p>Current symptoms:</p>
                    <p>About Me:</p>
                    <textarea
                        name="aboutMe"
                        value={this.state.updatedProfile}
                        onChange={e => this.handleChange(e)}
                    />
                    <br />
                    <button onClick={() => this.updateProfile()}>Save</button>
                </div>
            );
        } else if (this.props.profile) {
            // display current profile
            return (
                <div>
                    {/* profile here */}
                    <button onClick={() => this.editProfile()}>
                        Edit profile
                    </button>
                </div>
            );
            // else
            // Add button
        } else {
            return (
                <div>
                    <h3>Add a profile to start getting matches!</h3>
                    <button onClick={() => this.editProfile()}>
                        Add profile
                    </button>
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
