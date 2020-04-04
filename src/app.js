import React from "react";
import axios from "./axios";
import Profile from "./profile";
import ProfilePic from "./profile-pic";
import BioEditor from "./bio-editor";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUploader: false
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
                console.log("Current user: ", this.state.first);
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
    setBio(bioText) {
        this.setState({ bio: bioText });
        console.log("bio updated in App: ", this.state.bio);
    }
    render() {
        return (
            <React.Fragment>
                <header>
                    <img className="nav-logo" src="corona-love.png" />
                    <img
                        className="nav-profile-pic"
                        src={this.state.imgUrl}
                        alt={this.state.first}
                        onClick={() => this.showUploader()}
                    />
                </header>
                <div className="profile">
                    <Profile
                        first={this.state.first}
                        last={this.state.last}
                        profilePic={
                            <ProfilePic
                                first={this.state.first}
                                imgUrl={this.state.imgUrl}
                                showUploader={() => this.showUploader()}
                            />
                        }
                        bioEditor={
                            <BioEditor
                                bio={this.state.bio}
                                setBio={bioText => this.setBio(bioText)}
                            />
                        }
                    />
                </div>
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
