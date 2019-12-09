import ServiceBase from 'services/ServiceBase';
import BaseUrlConstants from 'constants/BaseUrlConstants';

class PasswordService extends ServiceBase {
    constructor() {
        super('null');
    }

    postPasswordRequest(passwordRequest) {
        return this.execute({
            url: `${BaseUrlConstants.BASE_URL}password-request`,
            method: 'POST',
            data: passwordRequest,
        });
    }

    patchPassword(resetPassword) {
        return this.execute({
            url: `${BaseUrlConstants.BASE_URL}password`,
            method: 'PATCH',
            data: resetPassword,
        });
    }
}

export default new PasswordService();
