exports.match = (user, users) => {
    const { gender, seeking, interests, symptoms } = user;
    console.log("Match algorithm is running");
    // loop through all users, returning only those whose gender matches the seeking of user
    // and whose seeking matches the gender of user
    const firstFilteredUsers = users.filter(
        user => user.gender + "s" == seeking && user.seeking == gender + "s"
    );
    // loop through first filtered group, returning only those with at least one matching interest
    const secondFilteredUsers = firstFilteredUsers.filter(user =>
        matchInterests(user)
    );
    // loop through second filtered group
    // if user has no symptoms, match with users with symptoms
    // if user has symptoms, match with users with no symptoms
    const finalFilteredUsers = secondFilteredUsers.filter(user =>
        matchSymptoms(user)
    );
    return finalFilteredUsers;

    function matchInterests(user) {
        const commonInterests = user.interests.filter(interest =>
            interests.includes(interest)
        );
        if (commonInterests.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    function matchSymptoms(user) {
        if (symptoms.length == 0) {
            if (user.symptoms.length > 0) {
                return true;
            }
            return false;
        } else {
            if (user.symptoms.length == 0) {
                return true;
            }
            return false;
        }
    }
};
