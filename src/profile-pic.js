import React from "react";

export default function ProfilePic({ first, last, imgUrl }) {
    imgUrl = imgUrl || "/default.png";
    let imgAlt = `${first}${last}`;
    console.log("image alt: ", imgAlt);
    return (
        <React.Fragment>
            <img className="nav-profile-pic" src={imgUrl} alt={imgAlt} />
        </React.Fragment>
    );
}
