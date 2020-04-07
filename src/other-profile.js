import React from "react";
import axios from "./axios";
import moment from "moment";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            interests: []
        };
    }
    componentDidMount() {
        console.log("Other user profile mounted");
        const id = this.props.match.params.id;
        console.log("id: ", id);
        axios.get(`/user/${id}.json`).then(({ data }) => {
            if (data.success) {
                console.log("Successfully fetched other user data: ", data);
                const {
                    first,
                    last,
                    imgUrl,
                    birthday,
                    gender,
                    seeking,
                    interests,
                    about
                } = data;
                this.setState(
                    {
                        first: first,
                        last: last,
                        imgUrl: imgUrl || "/default.png",
                        birthday: birthday,
                        gender: gender,
                        seeking: seeking,
                        interests: interests || [],
                        about: about
                    },
                    () => console.log("Other profile state: ", this.state)
                );
            } else {
                console.log("Error fetching user data");
            }
        });
    }
    convertDateToAge(birthday) {
        return moment().diff(moment(birthday), "years");
    }
    render() {
        return (
            <React.Fragment>
                <img
                    className="profile-pic"
                    src={this.state.imgUrl}
                    alt={this.state.first}
                />
                <div className="bio">
                    <h1 className="bioName">{this.state.first}</h1>
                    <h3>Age: {this.convertDateToAge(this.state.birthday)}</h3>
                    <h3>{this.state.about}</h3>
                    <br />
                    <h3>Gender: {this.state.gender}</h3>
                    <h3>Interested in: {this.state.seeking}</h3>
                    <h3>
                        Interests and hobbies: {this.state.interests.join(", ")}
                    </h3>
                </div>
            </React.Fragment>
        );
    }
}
