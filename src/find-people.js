import React, { useState, useEffect } from "react";
import axios from "./axios";
import PeopleList from "./people-list";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");
    const [error, setError] = useState(false);
    const [showRecent, setShowRecent] = useState(true);

    useEffect(() => {
        axios.get("/users/recent").then(({ data }) => {
            if (data.success) {
                setUsers(data.users);
                setError(false);
            } else {
                console.log("Error getting recent users");
                setError(true);
            }
        });
    }, []);

    useEffect(() => {
        let ignore = false;
        axios.get(`/users/${query}`).then(({ data }) => {
            if (data.success) {
                if (!ignore) {
                    setUsers(data.users);
                }
                setError(false);
                if (showRecent) {
                    setShowRecent(false);
                }
                console.log("response received from server");
            } else if (query) {
                console.log("error getting users by query");
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
            {showRecent && (
                <div className="recentUsers">
                    <h2>Most recent users:</h2>
                    <PeopleList users={users} />
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
                    <PeopleList users={users} />
                </div>
            )}
            {users.length == 0 && <h2>No results</h2>}
        </React.Fragment>
    );
}
