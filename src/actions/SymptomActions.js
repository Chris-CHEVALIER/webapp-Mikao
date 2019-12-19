import dispatcher from 'dispatchers/AppDispatcher';
import ActionsBase from 'actions/ActionsBase';

import SymptomConstants from 'constants/SymptomConstants';
import SymptomService from 'services/SymptomService';

class SymptomActions extends ActionsBase {
    create = (symptom) => {
        const $this = this;
        return new Promise((resolve, reject) => {
            function handleSuccess(newSymptom) {
                dispatcher.dispatch({
                    type: SymptomConstants.RECEIVE_SYMPTOM,
                    payload: {
                        symptom: newSymptom.data,
                    },
                });
                resolve(newSymptom.data);
            }
            function handleError(err) {
                $this.handleError(err, reject);
            }
            SymptomService.post(symptom)
                .then(handleSuccess)
                .catch(handleError);
        });
    };

    edit = (symptomId, symptom) => {
        const $this = this;
        return new Promise((
            resolve,
            reject
        ) => {
            function handleSuccess(newSymptom) {
                dispatcher.dispatch({
                    type: SymptomConstants.RECEIVE_SYMPTOM,
                    payload: {
                        symptom: newSymptom.data,
                    },
                });
                resolve(newSymptom.data);
            }
            function handleError(err) {
                $this.handleError(err, reject);
            }
            SymptomService.patch(symptomId, symptom)
                .then(handleSuccess)
                .catch(handleError);
        });
    };

    delete = (id) => {
        const $this = this;
        return new Promise((resolve, reject) => {
            function handleSuccess() {
                dispatcher.dispatch({
                    type: SymptomConstants.DELETE_SYMPTOM,
                    payload: {
                        id,
                    },
                });
                resolve();
            }
            function handleError(err) {                
                $this.handleError(err, reject);
            }
            SymptomService.remove(id)
                .then(handleSuccess)
                .catch(handleError);
        });
    };

    reload = () => {
        const $this = this;
        return new Promise((resolve, reject) => {
            function handleSuccess(res) {
                dispatcher.dispatch({
                    type: SymptomConstants.RECEIVE_SYMPTOMS,
                    payload: {
                        symptoms: res.data.results,
                    },
                });
                resolve();
            }
            function handleError(err) {
                $this.handleError(err, reject);
            }
            SymptomService.getAll()
                .then(handleSuccess)
                .catch(handleError);
        });
    };

    changeCurrentSymptomId = (symptomId) => new Promise((resolve, reject) => {
        dispatcher.dispatch({
            type: SymptomConstants.CHANGE_CURRENT_SYMPTOM,
            payload: {
                symptomId,
            },
        });
        resolve();
    });

    reloadById = (id) => {
        const $this = this;
        return new Promise((resolve, reject) => {
            function handleSuccess(res) {
                dispatcher.dispatch({
                    type: SymptomConstants.RECEIVE_SYMPTOM,
                    payload: {
                        symptom: res.data,
                    },
                });
                resolve();
            }
            function handleError(err) {
                $this.handleError(err, reject);
            }
            SymptomService.getById(id)
                .then(handleSuccess)
                .catch(handleError);
        });
    };
}

export default new SymptomActions();
