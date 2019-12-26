import BaseUrlContacts from 'constants/BaseUrlConstants';

export default {
    BASE_URL: BaseUrlContacts.BASE_URL,
    LOGIN_URL: BaseUrlContacts.BASE_URL + 'token',
    SIGNUP_URL: BaseUrlContacts.BASE_URL + 'users',

    LOGIN_USER: 'LOGIN_USER',
    LOGOUT_USER: 'LOGOUT_USER',
    RECEIVE_USER_LOGIN: 'RECEIVE_USER_LOGIN',
    USER_LOGGED_IN: 'USER_LOGGED_IN',
}
