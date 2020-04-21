import React from "react";
import { Link } from "react-router-dom";

export default function MatchList({ users, authorize }) {
    const userList = users.map(user => (
        <Link
            className="userCard"
            key={user.id}
            onClick={() => authorize()}
            to={"/user/" + user.id}
        >
            <img src={user.image_url || "/default.png"} />
            <h3>{user.first}</h3>
        </Link>
    ));
    return <React.Fragment>{userList}</React.Fragment>;
}
