import React from "react";

export default function ProfilePic({ first, imgUrl, showUploader }) {
    return (
        <React.Fragment>
            <img
                className="profile-pic"
                src={imgUrl}
                alt={first}
                onClick={showUploader}
            />
        </React.Fragment>
    );
}
