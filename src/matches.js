import React, { useState, useEffect } from "react";
import axios from "./axios";
import MatchList from "./match-list";

// ONLY SHOW MATCHES NOT ALREADY IN CONNECTIONS

export default function Matches({ authorize }) {
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
                console.log("response received from server", data.users);
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
            <input
                type="text"
                name="name"
                placeholder="Search your matches"
                onChange={handleChange}
            />
            {!query && (
                <div className="recentUsers">
                    <h2>Your matches:</h2>
                    <MatchList users={matches} authorize={() => authorize()} />
                </div>
            )}
            {query && (
                <div className="matchingUsers">
                    <MatchList users={matches} authorize={() => authorize()} />
                </div>
            )}
            {matches.length == 0 && <h2>No results</h2>}
        </React.Fragment>
    );
}
