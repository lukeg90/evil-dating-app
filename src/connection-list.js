import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function ConnectionList({
    users,
    authorize,
    buttonText,
    handleClick
}) {
    const dispatch = useDispatch();
    const userList = users.map(user => (
        <div className="connectionCard" key={user.id}>
            <Link
                className="userCard"
                onClick={() => authorize()}
                to={"/user/" + user.id}
            >
                <img src={user.image_url} />
            </Link>
            <div className="cardText">
                <h3>{user.first}</h3>
                <button onClick={() => dispatch(handleClick(user.id))}>
                    {buttonText}
                </button>
            </div>
        </div>
    ));
    return <React.Fragment>{userList}</React.Fragment>;
}
