import Login from 'constants/LoginConstants';
import BaseStore from 'stores/BaseStore';
import AppDispatcher from 'dispatchers/AppDispatcher';
import jwt_decode from 'jwt-decode';

function reduce(state, action) {
    const { type, payload } = action;
    let newState = Object.assign({}, state);
    
    switch (type) {
    case Login.LOGIN_USER:
        // We get the JWT from the action and save it locally.
        this._jwt = action.jwt;
        newState.jwt = action.jwt;
        // Then we decode it to get the user information.
        newState.user = jwt_decode(newState.jwt);
        this._user = newState.user;

        
        break;
    /*case Login.LOGIN_USER:
        newState.accessToken = payload.accessToken;
        newState.refreshToken = payload.refreshToken;
        newState.user = payload.user;
        newState.login = payload.login;
        break;*/
    case Login.LOGOUT_USER:
        newState.user = null;
        newState.accessToken = null;
        newState.refreshToken = null;
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
    /*constructor() {
        // First we register to the Dispatcher to listen for actions.
        this.dispatchToken = AppDispatcher.register(this._registerToActions.bind(this));
        this._user = null;
        this._jwt = null;
    }*/

    getInitialState() {
        return {
            //dispatchToken: AppDispatcher.register(this._registerToActions.bind(this)),
            _user: null,
            _jwt: null,
        };
    }

    reduce = reduce;

    // Just getters for the properties it got from the action.
    get user() {
        return this._user;
    }

    get jwt() {
        return this._jwt;
    }

    isLoggedIn() {
        return !!this._user;
    }

    getUser() {
        return this.getState().user;
    }

    getAccessToken() {
        return this.getState().accessToken;
    }

    getRefreshToken() {
        return this.getState().refreshToken;
    }

    getSecurityContext() {
        return this.getState().securityContext;
    }

    getLogin() {
        return this.getState().login;
    }

    /*isLoggedIn() {
        return !!this.getState().user;
    }*/
}

export default new LoginStore();
