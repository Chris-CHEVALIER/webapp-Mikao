import request from 'reqwest';
import when from 'when';
import TokenContainer from 'services/TokenContainer';

/**
 * Abstract class that contains basic methods for Services (GET / POST / PATCH / DELETE).
 */
export default class ServiceBase {
	
    /**
     * Execute a custom request to the API.
     * @param {{url, method, data}} url => The url of the request | method => The method of the request. Default is GET. | data => The data of the request (optionnal)
     * @returns {Promise} A promise to handle the request ascynchronously.
     */
    execute(options) {
        if (!options.url) {
            throw new Error('The URL is required');
        }

        const method = options.method || 'GET';

        const query = {
            url: options.url,
            method,
            crossOrigin: true,
            type: 'json',
            contentType: 'application/json',
            headers: { 'X-Auth-Token': TokenContainer.get() },
            data: undefined,
        };
        if (options.data) {
            query.data = JSON.stringify(options.data);
        }

        return when(request(query));
    }
}
