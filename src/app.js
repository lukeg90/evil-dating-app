import React from "react";
import axios from "./axios";
import ProfilePic from "./profile-pic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUploader: false
        };
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            this.setState(data);
            console.log("Current user: ", this.state.first);
        });
    }
    toggleUploader() {
        this.setState({
            showUploader: !this.state.showUploader
        });
        console.log("Show uploader: ", this.state.showUploader);
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
    render() {
        return (
            <div>
                <img className="nav-logo" src="corona-love.png"></img>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    imgUrl={this.state.imgUrl}
                    toggleUploader={() => this.toggleUploader()}
                />
                {this.state.showUploader && (
                    <Uploader setProfilePic={url => this.setProfilePic(url)} />
                )}
            </div>
        );
    }
}
