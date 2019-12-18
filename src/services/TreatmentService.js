import ServiceBase from 'services/ServiceBase';
import BaseUrlConstants from 'constants/BaseUrlConstants';

const URL = `${BaseUrlConstants.BASE_URL}`;

class TreatmentService extends ServiceBase {
    constructor() {
        super(URL);
    }

    /**
     * Get a treatment by unique identifier.
     * @param {number} treatmentId The identifier of the treatment.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    getById(treatmentId) {
        return this.execute({
            url: `${BaseUrlConstants.BASE_URL}treatments/${treatmentId}`,
            method: 'GET',
        });
    }
    
    /**
     * Get all unarchived treatments.
     *
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    getAll() {
        return this.execute({
            url: `${BaseUrlConstants.BASE_URL}treatments`,
            method: "GET"
        });
    }

    /**
     * Post a new treatment.
     * @param {Object} treatment The treatment to create.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    post(treatment) {
        return this.execute({
            url: `${BaseUrlConstants.BASE_URL}treatments`,
            method: 'POST',
            data: treatment,
        });
    }

    /**
     * Patch an existing resource. Only the properties that are set on the patch will be updated.
     * @param {number} id The identifier of the report.
     * @param {Object} patch The properties to update.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    patch(id, patch) {
        return this.execute({
            url: `${BaseUrlConstants.BASE_URL}treatments/${id}`,
            method: 'PATCH',
            data: patch,
        });
    }

    /**
     * Delete an existing host treatment.
     * @param {number} id The identifier of the user.
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    remove(id) {
        return this.execute({
            url: `${BaseUrlConstants.BASE_URL}treatments/${id}`,
            method: 'DELETE',
        });
    }
}

export default new TreatmentService();
