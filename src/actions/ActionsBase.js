import LoginActions from 'actions/LoginActions';
import Logger from 'services/Logger';

/**
 * The base class for Actions.
 * It contains some common and utils methods.
 */
export default class ActionsBase {

    /**
     * Handle errors that occurs during action execution.
     * @param {Object}                   error    The error to handle.
     * @param {(response)=>void} callback The callback executed after the error handling. It get in params the formatted error. (Optionnal)
     */
    handleError(error, callback) {
        Logger.error(error);
        LoginActions.logoutIfUnauthorized(error);

        if(callback){
            const response = error.response ? JSON.parse(error.response) : { message: 'Internal Error' };
            callback(response);
        }
    }
}
