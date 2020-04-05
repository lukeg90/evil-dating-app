import React from "react";
import axios from "./axios";
import List from "./profile-editor-list";

export default class ProfileEditor extends React.Component {
    constructor(props) {
        super(props);
        // internal state needs to update after all inputs but database and app state is only updated after clicking save
        this.state = {
            beingEdited: false,
            birthday: "",
            gender: "",
            seeking: "",
            interests: [],
            symptoms: [],
            about: ""
        };
    }
    handleChange({ target }) {
        console.log("Something changed");
        this.setState({
            [target.name]: target.value
        });
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
        console.log("Current state: ", this.state.interests);
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
            updatedProfile: this.props.profile
        });
    }
    updateProfile() {
        axios
            .post("/user/profile/update", {
                profile: this.state
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
                        required
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
                    <p>Interests:</p>
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
                    <p>Current symptoms:</p>
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
                    <p>About Me:</p>
                    <textarea
                        name="about"
                        value={this.state.about}
                        onChange={e => this.handleChange(e)}
                    />
                    <br />
                    <button onClick={() => this.updateProfile()}>Save</button>
                    <button
                        onClick={() => this.setState({ beingEdited: false })}
                    >
                        Cancel
                    </button>
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
