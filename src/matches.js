import React, { useState, useEffect } from "react";
import axios from "./axios";
import PeopleList from "./people-list";

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [query, setQuery] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        let ignore = false;
        // instead of getting all users, request should return a list of matches if user has added their profile
        axios.get(`/matches.json?q=${query}`).then(({ data }) => {
            if (data.success) {
                if (!ignore) {
                    setMatches(data.users);
                }
                setError(false);
                console.log("response received from server");
            } else {
                console.log("error getting users from server");
                setError(true);
            }
        });
        return () => {
            ignore = true;
        };
    }, [query]);

    const handleChange = e => {
        setQuery(e.target.value);
    };
    return (
        <React.Fragment>
            {error && <div className="error">Oops, there was an error</div>}
            <h1>Search matches</h1>
            <input
                type="text"
                name="name"
                placeholder="Enter name"
                onChange={handleChange}
            />
            {!query && (
                <div className="recentUsers">
                    <h2>Most recent users:</h2>
                    <PeopleList users={matches} />
                    <h2>Are you looking for someone in particular?</h2>
                </div>
            )}
            {query && (
                <div className="matchingUsers">
                    <PeopleList users={matches} />
                </div>
            )}
            {matches.length == 0 && <h2>No results</h2>}
        </React.Fragment>
    );
}
