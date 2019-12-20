import dispatcher from 'dispatchers/AppDispatcher';
import ActionsBase from 'actions/ActionsBase';

import UserConstants from 'constants/UserConstants';
import UserService from 'services/UserService';

class UserActions extends ActionsBase {
    create = (user) => {
        const $this = this;
        return new Promise((resolve, reject) => {
            function handleSuccess(newUser) {
                dispatcher.dispatch({
                    type: UserConstants.RECEIVE_USER,
                    payload: {
                        user: newUser.data,
                    },
                });
                resolve(newUser.data);
            }
            function handleError(err) {
                $this.handleError(err, reject);
            }
            UserService.post(user)
                .then(handleSuccess)
                .catch(handleError);
        });
    };

    edit = (userId, user) => {
        const $this = this;
        return new Promise((
            resolve,
            reject
        ) => {
            function handleSuccess(newUser) {
                dispatcher.dispatch({
                    type: UserConstants.RECEIVE_USER,
                    payload: {
                        user: newUser.data,
                    },
                });
                resolve(newUser.data);
            }
            function handleError(err) {
                $this.handleError(err, reject);
            }
            UserService.patch(userId, user)
                .then(handleSuccess)
                .catch(handleError);
        });
    };

    delete = (id) => {
        const $this = this;
        return new Promise((resolve, reject) => {
            function handleSuccess() {
                dispatcher.dispatch({
                    type: UserConstants.DELETE_USER,
                    payload: {
                        id,
                    },
                });
                resolve();
            }
            function handleError(err) {                
                $this.handleError(err, reject);
            }
            UserService.remove(id)
                .then(handleSuccess)
                .catch(handleError);
        });
    };

    reload = () => {
        const $this = this;
        return new Promise((resolve, reject) => {
            function handleSuccess(res) {
                dispatcher.dispatch({
                    type: UserConstants.RECEIVE_USERS,
                    payload: {
                        users: res.data.results,
                    },
                });
                resolve();
            }
            function handleError(err) {
                $this.handleError(err, reject);
            }
            UserService.getAll()
                .then(handleSuccess)
                .catch(handleError);
        });
    };

    changeCurrentUserId = (userId) => new Promise((resolve, reject) => {
        dispatcher.dispatch({
            type: UserConstants.CHANGE_CURRENT_USER,
            payload: {
                userId,
            },
        });
        resolve();
    });

    reloadById = (id) => {
        const $this = this;
        return new Promise((resolve, reject) => {
            function handleSuccess(res) {
                dispatcher.dispatch({
                    type: UserConstants.RECEIVE_USER,
                    payload: {
                        user: res.data,
                    },
                });
                resolve();
            }
            function handleError(err) {
                $this.handleError(err, reject);
            }
            UserService.getById(id)
                .then(handleSuccess)
                .catch(handleError);
        });
    };
}

export default new UserActions();
