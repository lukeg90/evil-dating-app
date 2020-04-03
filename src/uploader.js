import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    uploadImage(e) {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        axios
            .post("/user/image", formData)
            .then(({ data }) => {
                console.log("Image upload response data: ", data);
                console.log("Image: ", data.imgUrl);
                if (data.success) {
                    this.props.setProfilePic(data.imgUrl);
                } else {
                    this.setState({ error: true });
                }
            })
            .catch(err => {
                console.log("Error uploading image: ", err);
                this.setState({ error: true });
            });
    }
    render() {
        return (
            <div className="uploader-modal">
                <h1>Update your profile picture</h1>
                <label htmlFor="profile-pic" className="custom-file-upload">
                    <input
                        type="file"
                        name="profile-pic"
                        id="profile-pic"
                        accept="image/*"
                        onChange={e => this.uploadImage(e)}
                    />
                    Choose File
                </label>
                {this.state.error && (
                    <div className="error">Oops, something went wrong</div>
                )}
            </div>
        );
    }
}
