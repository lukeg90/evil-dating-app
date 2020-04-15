import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function ConnectionList({
    users,
    authorize,
    buttonText,
    otherButtonText,
    handleAccept,
    handleReject,
    handleRemove
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
                {otherButtonText ? (
                    <React.Fragment>
                        <button onClick={() => dispatch(handleAccept(user.id))}>
                            {buttonText}
                        </button>
                        <button onClick={() => dispatch(handleReject(user.id))}>
                            {otherButtonText}
                        </button>
                    </React.Fragment>
                ) : (
                    <button onClick={() => dispatch(handleRemove(user.id))}>
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    ));
    return <React.Fragment>{userList}</React.Fragment>;
}
