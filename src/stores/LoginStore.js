import Login from 'constants/LoginConstants';
import BaseStore from 'stores/BaseStore';

function reduce(state, action) {
    const { type, payload } = action;
    let newState = Object.assign({}, state);
    switch (type) {
    case Login.LOGIN_USER:
        newState.accessToken = payload.accessToken;
        newState.refreshToken = payload.refreshToken;
        newState.user = payload.user;
        //newState.securityContext = payload.securityContext;
        newState.login = payload.login;
        break;
    case Login.LOGOUT_USER:
        newState.user = null;
        newState.accessToken = null;
        newState.refreshToken = null;
        //newState.securityContext = null;
        break;
    case Login.RECEIVE_USER_LOGIN:
        newState.login = payload.login;
        break;
    default:
        newState = state;
    }
    return newState;
}

class LoginStore extends BaseStore {
    getInitialState() {
        return {
            user: null,
            accessToken: null,
            refreshToken: null,
            //secutiryContext: null,
            login: null,
        };
    }

    reduce = reduce;

    getUser() {
        return this.getState().user;
    }

    getAccessToken() {
        return this.getState().accessToken;
    }

    getRefreshToken() {
        return this.getState().refreshToken;
    }

    /*getSecurityContext() {
        return this.getState().securityContext;
    }*/

    getLogin() {
        return this.getState().login;
    }

    isLoggedIn() {
        return !!this.getState().user;
    }
}

export default new LoginStore();
