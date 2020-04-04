import React from "react";

export default function Profile({ first, last, profilePic, profileEditor }) {
    return (
        <React.Fragment>
            {profilePic}
            <div className="bio">
                <h1 className="bioName">
                    {first} {last}
                </h1>
                {profileEditor}
            </div>
        </React.Fragment>
    );
}
