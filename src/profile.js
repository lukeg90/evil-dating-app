import React from "react";

export default function Profile({ first, last, profilePic, bioEditor }) {
    return (
        <React.Fragment>
            {profilePic}
            <div className="bio">
                <h1 className="bioName">
                    {first} {last}
                </h1>
                {bioEditor}
            </div>
        </React.Fragment>
    );
}
