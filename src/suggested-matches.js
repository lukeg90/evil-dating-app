import React, { useState, useEffect } from "react";
import axios from "./axios";
import PeopleList from "./people-list";

export default function SuggestedMatches() {
    const [matches, setMatches] = useState([]);
    const [query, setQuery] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        let ignore = false;
        axios.get(`/matches/list?q=${query}`).then(({ data }) => {
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
            <h1>Find people</h1>
            {!query && (
                <div className="recentUsers">
                    <h2>Most recent users:</h2>
                    <PeopleList users={matches} />
                    <h2>Are you looking for someone in particular?</h2>
                </div>
            )}
            <input
                type="text"
                name="name"
                placeholder="Enter name"
                onChange={handleChange}
            />
            {query && (
                <div className="matchingUsers">
                    <PeopleList users={matches} />
                </div>
            )}
            {matches.length == 0 && <h2>No results</h2>}
        </React.Fragment>
    );
}

//// NEXT STEPS ///////

//// Convert people to suggested matches ////
// Refactor FindPeople so it only displays suggested matches
// Suggested matches criteria
// Gender matches seeking of user
// Age matches user inputted age range
// Check for one common interest
// Only match if symptoms are unbalanced

// matches should be kept in state of app
