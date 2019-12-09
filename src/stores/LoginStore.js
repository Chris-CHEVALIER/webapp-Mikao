import Login from 'constants/LoginConstants';
import BaseStore from 'stores/BaseStore';

function reduce(state, action) {
    const { type, payload } = action;
    let newState = Object.assign({}, state);
    switch (type) {
    case Login.LOGIN_USER:
        newState.jwt = payload.jwt;
        newState.user = payload.user;
        newState.securityContext = payload.securityContext;
        newState.login = payload.login;
        break;
    case Login.LOGOUT_USER:
        newState.user = null;
        newState.jwt = null;
        newState.securityContext = null;
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
            jwt: null,
            secutiryContext: null,
            login: null,
        };
    }

    reduce = reduce;

    getUser() {
        return this.getState().user;
    }

    getJwt() {
        return this.getState().jwt;
    }

    getSecurityContext() {
        return this.getState().securityContext;
    }

    getLogin() {
        return this.getState().login;
    }

    isLoggedIn() {
        return !!this.getState().user;
    }
}

export default new LoginStore();
