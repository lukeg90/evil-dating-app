import React from "react";
import axios from "./axios";
import Profile from "./profile";
import ProfilePic from "./profile-pic";
import ProfileEditor from "./profile-editor";
import Uploader from "./uploader";
import OtherProfile from "./other-profile";
import Matches from "./matches";
import Connections from "./connections";
import { BrowserRouter, Route, Link, Redirect } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUploader: false,
            profileUpdated: false,
            userIsMatch: false
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
                // check a required field to fsee if profile has been added
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
    logout() {
        axios.get("/logout").then(() => {
            window.location.reload();
            console.log("logged out");
        });
    }
    authorize() {
        this.setState({ userIsMatch: true });
        console.log("authorized: ", this.state.userIsMatch);
    }
    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <header>
                        <img className="nav-logo" src="/corona-love.png" />
                        <div className="navbar">
                            <Link to="/">
                                <h3 className="nav-link">Profile</h3>
                            </Link>
                            <Link to="/matches">
                                <h3 className="nav-link">Matches</h3>
                            </Link>
                            <Link to="/friends">
                                <h3 className="nav-link">Friends</h3>
                            </Link>
                            <h3
                                className="nav-link"
                                onClick={() => this.logout()}
                            >
                                Logout
                            </h3>
                            <img
                                className="nav-profile-pic"
                                src={this.state.imgUrl}
                                alt={this.state.first}
                                onClick={() => this.showUploader()}
                            />
                        </div>
                    </header>
                    <Route
                        path="/matches"
                        render={() => (
                            <Matches
                                profileUpdated={this.state.profileUpdated}
                                authorize={() => this.authorize()}
                            />
                        )}
                    />
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
                            render={props =>
                                this.state.userIsMatch ? (
                                    <OtherProfile
                                        key={props.match.url}
                                        match={props.match}
                                        history={props.history}
                                    />
                                ) : (
                                    <Redirect to="/" />
                                )
                            }
                        />
                    </div>
                    <Route
                        exact
                        path="/connections"
                        render={() => <Connections />}
                    />
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
