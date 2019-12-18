import dispatcher from 'dispatchers/AppDispatcher';
import ActionsBase from 'actions/ActionsBase';

import TreatmentConstants from 'constants/TreatmentConstants';
import TreatmentService from 'services/TreatmentService';

class TreatmentActions extends ActionsBase {
    create = (treatment) => {
        const $this = this;
        return new Promise((resolve, reject) => {
            function handleSuccess(newTreatment) {
                dispatcher.dispatch({
                    type: TreatmentConstants.RECEIVE_TREATMENT,
                    payload: {
                        treatment: newTreatment,
                    },
                });
                resolve(newTreatment);
            }
            function handleError(err) {
                $this.handleError(err, reject);
            }
            TreatmentService.post(treatment)
                .then(handleSuccess)
                .catch(handleError);
        });
    };

    edit = (treatmentId, treatment) => {
        const $this = this;
        return new Promise((
            resolve,
            reject
        ) => {
            function handleSuccess(newTreatment) {
                dispatcher.dispatch({
                    type: TreatmentConstants.RECEIVE_TREATMENT,
                    payload: {
                        treatment: newTreatment,
                    },
                });
                resolve(newTreatment);
            }
            function handleError(err) {
                $this.handleError(err, reject);
            }
            TreatmentService.patch(treatmentId, treatment)
                .then(handleSuccess)
                .catch(handleError);
        });
    };

    delete = (id) => {
        const $this = this;
        return new Promise((resolve, reject) => {
            function handleSuccess() {
                dispatcher.dispatch({
                    type: TreatmentConstants.DELETE_TREATMENT,
                    payload: {
                        id,
                    },
                });
                resolve();
            }
            function handleError(err) {
                $this.handleError(err, reject);
            }
            TreatmentService.remove(id)
                .then(handleSuccess)
                .catch(handleError);
        });
    };

    reload = () => {
        const $this = this;
        return new Promise((resolve, reject) => {
            function handleSuccess(treatments) {
                dispatcher.dispatch({
                    type: TreatmentConstants.RECEIVE_TREATMENTS,
                    payload: {
                        treatments,
                    },
                });
                resolve();
            }
            function handleError(err) {
                $this.handleError(err, reject);
            }
            TreatmentService.getAll()
                .then(handleSuccess)
                .catch(handleError);
        });
    };

    changeCurrentTreatmentId = (treatmentId) => new Promise((resolve, reject) => {
        dispatcher.dispatch({
            type: TreatmentConstants.CHANGE_CURRENT_TREATMENT,
            payload: {
                treatmentId,
            },
        });
        resolve();
    });

    reloadById = (id) => {
        const $this = this;
        return new Promise((resolve, reject) => {
            function handleSuccess(treatment) {
                dispatcher.dispatch({
                    type: TreatmentConstants.RECEIVE_TREATMENT,
                    payload: {
                        treatment,
                    },
                });
                resolve();
            }
            function handleError(err) {
                $this.handleError(err, reject);
            }
            TreatmentService.getById(id)
                .then(handleSuccess)
                .catch(handleError);
        });
    };
}

export default new TreatmentActions();
