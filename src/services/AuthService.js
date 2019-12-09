import ServiceBase from 'services/ServiceBase';
import BaseUrlConstants from 'constants/BaseUrlConstants';
import LoginActions from 'actions/LoginActions';

class AuthService extends ServiceBase {
    /**
     * Try to log the user to the application.
     * @param  {string} login    The login or email.
     * @param  {string} password The plain password.
     * @return {Promise}         A promise of the request.
     */
    login(login, password) {
        return this.handleAuth(login,
            this.execute({
                url: `${BaseUrlConstants.BASE_URL}auth-tokens`,
                method: 'POST',
                data: {
                    login,
                    password,
                },
            }),
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
    handleAuth(login, loginPromise) {
        return loginPromise.then((response) => {
            const jwt = response.value;
            const user = response.user;
            const securityContext = response.securityContext;
            LoginActions.loginUser(jwt, user, securityContext, login);
            return true;
        });
    }
}

export default new AuthService();
