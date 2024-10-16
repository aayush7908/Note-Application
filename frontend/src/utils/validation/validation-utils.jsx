const emailRegex = /^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

export function validateEmail(email) {
    return emailRegex.test(email);
}

export function validatePassword(password) {
    return passwordRegex.test(password);
}

export function validateOtp(otp) {
    return (otp.length === 8);
}