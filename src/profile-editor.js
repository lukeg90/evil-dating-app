import React from "react";
import axios from "./axios";
import List from "./profile-editor-list";
import moment from "moment";

export default class ProfileEditor extends React.Component {
    constructor(props) {
        super(props);
        // internal state needs to update after all inputs but database and app state is only updated after clicking save
        this.state = {
            beingEdited: false,
            interests: [],
            symptoms: []
        };
    }
    handleChange({ target }) {
        console.log("Something changed");
        this.setState({
            [target.name]: target.value
        });
    }
    convertDateToAge(birthday) {
        return moment().diff(moment(birthday), "years");
    }
    addElement(array, arrayName, elementId) {
        const element = document.getElementById(elementId);
        console.log("Interest current value: ", element.value);
        const value = element.value.toLowerCase();
        // add element to array if input has value and if it is not already present
        if (element.value && !array.includes(value)) {
            this.setState({
                [arrayName]: [...array, value]
            });
            element.value = "";
        }
    }
    removeElement(e, array, stateProp) {
        console.log(
            "remove elment event: ",
            e.target.previousElementSibling.innerHTML
        );
        const element = e.target.previousElementSibling.innerHTML;
        const index = array.indexOf(element);
        if (index > -1) {
            array.splice(index, 1);
        }
        this.setState({ [stateProp]: array });
    }
    editProfile() {
        this.setState({
            beingEdited: true,
            birthday: this.props.birthday,
            gender: this.props.gender,
            seeking: this.props.seeking,
            interests: this.props.interests,
            symptoms: this.props.symptoms,
            about: this.props.about
        });
        console.log("current state: ", this.state);
    }
    updateProfile() {
        axios
            .post("/user/profile/update", {
                profile: this.state
            })
            .then(({ data }) => {
                if (data.success) {
                    console.log("Profile updated successfully: ", data);
                    this.props.setProfile(data.updatedProfile);
                    this.setState({ beingEdited: false, error: false });
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
                    <p className="label" style={{ margin: 0 }}>
                        Date of birth:{" "}
                        <span>{this.state.birthday || "None selected"}</span>
                    </p>
                    <label className="label" id="date" htmlFor="birthday">
                        Edit:
                    </label>
                    <input
                        type="date"
                        name="birthday"
                        id="birthday"
                        max="2003-01-01"
                        onChange={e => this.handleChange(e)}
                    />
                    <br />
                    <div onChange={e => this.handleChange(e)}>
                        <p className="label">Gender:</p>
                        <label htmlFor="male">Male</label>
                        <input
                            type="radio"
                            name="gender"
                            id="male"
                            value="male"
                            checked={this.state.gender == "male"}
                        />
                        <label htmlFor="female">Female</label>
                        <input
                            type="radio"
                            name="gender"
                            id="female"
                            value="female"
                            checked={this.state.gender == "female"}
                        />
                        <label htmlFor="other">Other</label>
                        <input
                            type="radio"
                            name="gender"
                            id="other"
                            value="other"
                            checked={this.state.gender == "other"}
                        />
                    </div>
                    <div onChange={e => this.handleChange(e)}>
                        <p className="label">Interested in:</p>
                        <label htmlFor="males">Males</label>
                        <input
                            type="radio"
                            name="seeking"
                            id="males"
                            value="males"
                            checked={this.state.seeking == "males"}
                        />
                        <label htmlFor="females">Females</label>
                        <input
                            type="radio"
                            name="seeking"
                            id="females"
                            value="females"
                            checked={this.state.seeking == "females"}
                        />
                        <label htmlFor="others">Others</label>
                        <input
                            type="radio"
                            name="seeking"
                            id="others"
                            value="others"
                            checked={this.state.seeking == "others"}
                        />
                    </div>
                    <p className="label">Interests:</p>
                    <div>
                        <List
                            elements={this.state.interests}
                            removeElement={e =>
                                this.removeElement(
                                    e,
                                    this.state.interests,
                                    "interests"
                                )
                            }
                        />
                    </div>
                    <input
                        type="text"
                        name="interest"
                        id="interest"
                        placeholder="Add an interest"
                    />
                    <button
                        onClick={() =>
                            this.addElement(
                                this.state.interests,
                                "interests",
                                "interest"
                            )
                        }
                    >
                        Add
                    </button>
                    <br />
                    <p className="label">Current symptoms:</p>
                    <div>
                        <List
                            elements={this.state.symptoms}
                            removeElement={e =>
                                this.removeElement(
                                    e,
                                    this.state.symptoms,
                                    "symptoms"
                                )
                            }
                        />
                    </div>
                    <select name="symptom" id="symptom">
                        <option value="">--Select a symptom--</option>
                        <option value="sore throat">Sore throat</option>
                        <option value="runny nose">Runny nose</option>
                        <option value="sneezing">Sneezing</option>
                        <option value="headache">Headache</option>
                        <option value="fever">Fever</option>
                        <option value="cough">Cough</option>
                        <option value="vomiting">Vomiting</option>
                        <option value="body aches">Body aches</option>
                        <option value="fatigue">Fatigue</option>
                        <option value="shortness of breath">
                            Shortness of breath
                        </option>
                    </select>
                    <button
                        onClick={() =>
                            this.addElement(
                                this.state.symptoms,
                                "symptoms",
                                "symptom"
                            )
                        }
                    >
                        Add
                    </button>
                    <br />
                    <p className="label">About Me:</p>
                    <textarea
                        name="about"
                        value={this.state.about}
                        onChange={e => this.handleChange(e)}
                    />
                    <br />
                    <button id="save" onClick={() => this.updateProfile()}>
                        Save
                    </button>
                    <button
                        onClick={() =>
                            this.setState({ beingEdited: false, error: false })
                        }
                    >
                        Cancel
                    </button>
                </div>
            );
        } else if (this.props.profileUpdated) {
            // display current profile
            return (
                <div>
                    <h3>Age: {this.convertDateToAge(this.props.birthday)}</h3>
                    <h3>{this.props.about}</h3>
                    <br />
                    <h3>Gender: {this.props.gender}</h3>
                    <h3>Interested in: {this.props.seeking}</h3>
                    <h3>
                        Interests and hobbies: {this.props.interests.join(", ")}
                    </h3>
                    <h3>Current symptoms: {this.props.symptoms.join(", ")}</h3>
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
