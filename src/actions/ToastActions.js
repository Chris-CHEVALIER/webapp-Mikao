import { notification } from 'antd';

class ToastActions {
    createToast(message, description, toastType) {
        notification[toastType]({
            message,
            description,
        });
    }

    createToastError(message, description) {
        this.createToast(message, description, 'error');
    }
    createToastSuccess(message, description) {
        this.createToast(message, description, 'success');
    }
}

export default new ToastActions();