import ServiceBase from 'services/ServiceBase';
import BaseUrlConstants from 'constants/BaseUrlConstants';
import axios from 'axios';

const URL = `${BaseUrlConstants.BASE_URL}`;

class SymptomService extends ServiceBase {
    constructor() {
        super(URL);
    }

    /**
     * Get a symptom by unique identifier.
     * @param {number} symptomId The identifier of the symptom.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    getById(symptomId) {
        return axios({
            url: `${BaseUrlConstants.BASE_URL}symptoms/${symptomId}`,
            method: 'GET',
        });
    }
    
    /**
     * Get all symptoms.
     *
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    getAll() {
        return axios({
            url: `${BaseUrlConstants.BASE_URL}symptoms/`,
            method: "get",
            
        });
    }

    /**
     * Post a new symptom.
     * @param {Object} symptom The symptom to create.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    post(symptom) {
        console.log("POST");
        
        console.log(symptom);
        return axios({
            url: `${BaseUrlConstants.BASE_URL}symptoms/`,
            method: 'POST',
            data: symptom,
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
            url: `${BaseUrlConstants.BASE_URL}symptoms/${id}/`,
            method: 'PATCH',
            data: patch,
        });
    }

    /**
     * Delete an existing host symptom.
     * @param {number} id The identifier of the user.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    remove(id) {
        console.log("remove", id);
        
        return axios({
            url: `${BaseUrlConstants.BASE_URL}symptoms/${id}/`,
            method: 'DELETE',
        });
    }
}

export default new SymptomService();
