import React from "react";
import axios from "./axios";
import Profile from "./profile";
import ProfilePic from "./profile-pic";
import ProfileEditor from "./profile-editor";
import Uploader from "./uploader";
import OtherProfile from "./other-profile";
import FindPeople from "./find-people";
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUploader: false,
            profileUpdated: false
        };
    }
    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                if (!data.imgUrl) {
                    data.imgUrl = "/default.png";
                }
                this.setState(data);
                // check a required field to fsee if profile has been updated
                if (data.birthday) {
                    this.setState({ profileUpdated: true });
                }
                console.log("Current user data: ", this.state);
            })
            .catch(err => {
                console.log("Error fetching user data: ", err);
            });
    }
    showUploader() {
        this.setState({ showUploader: true });
        console.log("Show uploader: ", this.state.showUploader);
    }
    hideUploader() {
        this.setState({ showUploader: false });
    }
    setProfilePic(url) {
        this.setState({
            imgUrl: url,
            showUploader: false
        });
        console.log("Url from child: ", url);
        console.log(
            "Image URL of App component has been set: ",
            this.state.imgUrl
        );
    }
    setProfile(updatedProfile) {
        const {
            birthday,
            gender,
            seeking,
            interests,
            symptoms,
            about
        } = updatedProfile;
        this.setState({
            profileUpdated: true,
            birthday: birthday,
            gender: gender,
            seeking: seeking,
            interests: interests,
            symptoms: symptoms,
            about: about
        });
        console.log("Profile updated in App: ", this.state);
    }
    render() {
        return (
            <React.Fragment>
                <header>
                    <img className="nav-logo" src="/corona-love.png" />
                    <img
                        className="nav-profile-pic"
                        src={this.state.imgUrl}
                        alt={this.state.first}
                        onClick={() => this.showUploader()}
                    />
                </header>
                <BrowserRouter>
                    <Route path="/users" component={FindPeople} />
                    <div className="profile">
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    profilePic={
                                        <ProfilePic
                                            first={this.state.first}
                                            imgUrl={this.state.imgUrl}
                                            showUploader={() =>
                                                this.showUploader()
                                            }
                                        />
                                    }
                                    profileEditor={
                                        <ProfileEditor
                                            profileUpdated={
                                                this.state.profileUpdated
                                            }
                                            birthday={this.state.birthday}
                                            gender={this.state.gender}
                                            seeking={this.state.seeking}
                                            interests={
                                                this.state.interests || []
                                            }
                                            symptoms={this.state.symptoms || []}
                                            about={this.state.about || ""}
                                            setProfile={userData =>
                                                this.setProfile(userData)
                                            }
                                        />
                                    }
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/user/:id"
                            render={props => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                    </div>
                </BrowserRouter>
                {this.state.showUploader && (
                    <Uploader
                        setProfilePic={url => this.setProfilePic(url)}
                        hideUploader={() => this.hideUploader()}
                    />
                )}
            </React.Fragment>
        );
    }
}
