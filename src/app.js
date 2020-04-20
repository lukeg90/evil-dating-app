import React, { useState, useEffect } from "react";
import axios from "./axios";
import Profile from "./profile";
import ProfilePic from "./profile-pic";
import ProfileEditor from "./profile-editor";
import Uploader from "./uploader";
import OtherProfile from "./other-profile";
import Matches from "./matches";
import Connections from "./connections";
import Chat from "./chat";
import Faq from "./faq";
import { BrowserRouter, Route, Link, Redirect } from "react-router-dom";

export default function App() {
    const [showUploader, setShowUploader] = useState(false);
    const [profileUpdated, setProfileUpdated] = useState(false);
    const [userIsMatch, setUserIsMatch] = useState(false);
    const [profile, setProfile] = useState({});
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        axios
            .get("/user")
            .then(({ data }) => {
                if (!data.imgUrl) {
                    data.imgUrl = "/default.png";
                }
                // check a required field to see if profile has been added
                if (data.birthday) {
                    setProfileUpdated(true);
                }
                setProfile(data);
            })
            .catch(err => {
                console.log("Error fetching user data: ", err);
            });
    }, []);
    console.log("Profile: ", profile);
    console.log("Birthday: ", profile.birthday);

    const setProfilePic = url => {
        setShowUploader(false);
        setProfile({ ...profile, imgUrl: url });
        console.log("Url from child: ", url);
        console.log(
            "Image URL of App component has been set: ",
            profile.imgUrl
        );
    };

    const setProfileFromChild = updatedProfile => {
        console.log("Updated profile from child:: ", updatedProfile);
        const {
            birthday,
            gender,
            seeking,
            interests,
            symptoms,
            about
        } = updatedProfile;
        console.log("birthday in updated profile: ", birthday);
        setProfile({
            ...profile,
            birthday,
            gender,
            seeking,
            interests,
            symptoms,
            about
        });
        setProfileUpdated(true);
    };

    const logout = () => {
        axios.get("/logout").then(() => {
            window.location.reload();
            console.log("logged out");
        });
    };

    const authorize = () => {
        setUserIsMatch(true);
        console.log("authorized: ", userIsMatch);
    };

    return (
        <React.Fragment>
            <BrowserRouter>
                <header>
                    <img className="nav-logo" src="/corona-love.png" />
                    <div className="navbar">
                        <h3
                            className="nav-link"
                            onClick={() => setShowChat(true)}
                        >
                            Chat
                        </h3>
                        <Link to="/">
                            <h3 className="nav-link">Profile</h3>
                        </Link>
                        <Link to="/matches">
                            <h3 className="nav-link">Matches</h3>
                        </Link>
                        <Link to="/connections">
                            <h3 className="nav-link">Connections</h3>
                        </Link>
                        <Link to="/faq">
                            <h3 className="nav-link">FAQ</h3>
                        </Link>
                        <h3 className="nav-link" onClick={() => logout()}>
                            Logout
                        </h3>
                        <img
                            className="nav-profile-pic"
                            src={profile.imgUrl}
                            alt={profile.first}
                            onClick={() => setShowUploader(true)}
                        />
                    </div>
                </header>
                <Chat
                    userId={profile.id}
                    show={showChat}
                    setShow={() => setShowChat()}
                />
                <div className="profile">
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={profile.first}
                                last={profile.last}
                                profilePic={
                                    <ProfilePic
                                        first={profile.first}
                                        imgUrl={profile.imgUrl}
                                        showUploader={() =>
                                            setShowUploader(true)
                                        }
                                    />
                                }
                                profileEditor={
                                    <ProfileEditor
                                        profileUpdated={profileUpdated}
                                        birthday={profile.birthday}
                                        gender={profile.gender}
                                        seeking={profile.seeking}
                                        interests={profile.interests || []}
                                        symptoms={profile.symptoms || []}
                                        about={profile.about || ""}
                                        setProfile={userData =>
                                            setProfileFromChild(userData)
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
                            userIsMatch ? (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            ) : (
                                <Redirect to="/matches" />
                            )
                        }
                    />
                </div>
                <Route
                    path="/matches"
                    render={() => <Matches authorize={() => authorize()} />}
                />
                <Route
                    exact
                    path="/connections"
                    render={() => <Connections authorize={() => authorize()} />}
                />
                <Route exact path="/faq" render={() => <Faq />} />
            </BrowserRouter>
            {showUploader && (
                <Uploader
                    setProfilePic={url => setProfilePic(url)}
                    hideUploader={() => setShowUploader(false)}
                />
            )}
        </React.Fragment>
    );
}
