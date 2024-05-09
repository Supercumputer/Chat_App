function isEmail(value) {
    let regex = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
    return regex.test(value);
}

function isPassWord(value) {
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(value);
}

function isPhoneNumber(value) {
    let regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return regex.test(value);
}

export {isEmail, isPassWord, isPhoneNumber}