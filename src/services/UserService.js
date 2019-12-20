import ServiceBase from 'services/ServiceBase';
import BaseUrlConstants from 'constants/BaseUrlConstants';
import axios from 'axios';

const URL = `${BaseUrlConstants.BASE_URL}`;

class UserService extends ServiceBase {
    constructor() {
        super(URL);
    }

    /**
     * Get a user by unique identifier.
     * @param {number} userId The identifier of the user.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */

    getById(userId) {
        return axios({
            url: `${BaseUrlConstants.BASE_URL}users/${userId}`,
            method: 'GET',
        });
    }
    
    /**
     * Get all users.
     *
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    getAll() {
        return axios({
            url: `${BaseUrlConstants.BASE_URL}users/`,
            method: "get",
            
        });
    }

    /**
     * Post a new user.
     * @param {Object} user The user to create.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    post(user) {
        return axios({
            url: `${BaseUrlConstants.BASE_URL}users/`,
            method: 'POST',
            data: user,
        });
    }

    /**
     * Patch an existing resource. Only the properties that are set on the patch will be updated.
     * @param {number} id The identifier of the report.
     * @param {Object} patch The properties to update.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    patch(id, patch) {
        return axios({
            url: `${BaseUrlConstants.BASE_URL}users/${id}/`,
            method: 'PATCH',
            data: patch,
        });
    }

    /**
     * Delete an existing host user.
     * @param {number} id The identifier of the user.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    remove(id) {
        return axios({
            url: `${BaseUrlConstants.BASE_URL}users/${id}/`,
            method: 'DELETE',
        });
    }
}

export default new UserService();
