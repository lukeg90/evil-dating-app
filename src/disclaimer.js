import React from "react";
import { Link } from "react-router-dom";

export default function Disclaimer({ hideDisclaimer }) {
    return (
        <div className="uploader-modal">
            <h1 className="close-modal" onClick={() => hideDisclaimer()}>
                X
            </h1>
            <h4 className="disclaimer-text">
                We ask for this information to ensure the safety of all our
                users. Rest assured that no other users will be able to see your
                current symptoms.
            </h4>
            <h4>
                <Link to="/faq">Read our FAQ</Link> for more information
            </h4>
        </div>
    );
}
