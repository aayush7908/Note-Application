const VALID_PWD_RESET_TOKEN_DURATION = 1000 * 60 * 10;  // 10 mins

const generateToken = (email) => {
    const token = "svkjbasslnwddvln9-23u5dkfjbvkjasbf";
    return {
        userEmail: email,
        token: token,
        expiresOn: new Date(Date.now() + VALID_PWD_RESET_TOKEN_DURATION)
    };
}

module.exports = {
    generateToken
}