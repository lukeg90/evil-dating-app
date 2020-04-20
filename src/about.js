import React from "react";
import { Link } from "react-router-dom";

export default function About() {
    return (
        <div className="blurb">
            <h2>
                As long as two people are allowed to meet in public, dating will
                live on. However, we know that these are uncertain times with
                potentially deadly consequences when it comes to social
                interaction, which is why we decided to create a new kind of
                dating platform where everyone can feel safe.
                <br />
                <br />
                We know how awkward it can be to discuss your symptoms with
                others, so we take care of it for you! How does it work? All our
                users are requested to list their current symptoms on their
                profile and our certified matching algorithm will analyze this
                data and only suggest matches deemed to be safe.
            </h2>
            <h2>
                <Link to="/">
                    <b>Register</b>
                </Link>{" "}
                to start getting matches!
            </h2>
        </div>
    );
}
