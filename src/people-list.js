import React from "react";
import { Link } from "react-router-dom";

export default function PeopleList({ users }) {
    const userList = users.map(user => (
        <Link className="userCard" key={user.id} to={"/user/" + user.id}>
            <img src={user.image_url} />
            <h3>{user.first}</h3>
        </Link>
    ));
    return <React.Fragment>{userList}</React.Fragment>;
}
