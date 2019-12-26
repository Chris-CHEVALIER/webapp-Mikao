//import ServiceBase from 'services/ServiceBase';
import BaseUrlConstants from 'constants/BaseUrlConstants';
import LoginActions from 'actions/LoginActions';
import axios from 'axios';

class AuthService /*extends ServiceBase*/ {
    /**
     * Try to log the user to the application.
     * @param  {string} login    The login or email.
     * @param  {string} password The plain password.
     * @return {Promise}         A promise of the request.
     */
    login(login, password) {
        let data = new FormData();
        data.set('username', login);
        data.set('password', password);
        return this.handleAuth(axios({
                method: 'post',
                url: `${BaseUrlConstants.BASE_URL}token/`,
                data,
            })
        );
    }

    /**
     * Log out the user from the application.
     */
    logout() {
        LoginActions.logoutUser();
    }

    /**
     * Handle the promise of the API request to log the user in.
     * @param  {Promise} loginPromise The promise of the API request.
     * @return {Promise}              The same promise, to allow catching error after.
     */
    handleAuth(loginPromise) {
        return loginPromise.then((response) => {
            const jwt = response.data.access;
            LoginActions.loginUser(jwt);
            return true;
        });
    }
}

export default new AuthService();
