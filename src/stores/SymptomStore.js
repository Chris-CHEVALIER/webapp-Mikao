import EntityStoreBase from "stores/EntityStoreBase";
import SymptomConstants from "constants/SymptomConstants";

class SymptomStore extends EntityStoreBase {
    getInitialState() {
        return {
            currentSymptomId: null,
            entities: [],
        };
    }

    reduce(state, action) {
        const { type, payload } = action;
        let newState = Object.assign({}, state);
        switch (type) {
            case SymptomConstants.RECEIVE_SYMPTOM:
                newState = this._receiveEntity(state, payload.symptom);
                break;
            case SymptomConstants.RECEIVE_SYMPTOMS:
                newState = this._receiveMany(state, payload.symptoms);
                break;
            case SymptomConstants.CHANGE_CURRENT_SYMPTOM:
                newState.currentSymptomId = payload.symptomId;
                break;
            case "clearAll":
                newState = this.getInitialState();
                break;
            default:
                newState = state;
        }
        return newState;
    }

    _receiveMany = (state, symptoms) => {
        let newState = Object.assign({}, state);
        // We remove all the entities that have the same ID as the new symptoms
        newState.entities = state.entities.filter(
            e => symptoms.findIndex(a => e.id === a.id) === -1
        );
        newState.entities.push(...symptoms);
        return newState;
    };

    ///// Public Methods  /////
    getSymptom() {
        return this.getState().symptom;
    }

    /**
     * Get a symptom by ID.
     * @param {number} id The identifier.
     * @return {?Symptom}    The symptom, or NULL if no entity is found.
     */
    getById = (id) => {
        return this.getState().entities.find(e => e.id === id);
    };

    /**
     * Get symptoms.
     */
    getSymptoms = () =>  {
        return this.getState().entities;
    }

    /**
     * Get the identifier of the current symptom.
     * @return {[type]} [description]
     */
    getCurrentSymptomId = () => {
        return (
            this.getState().currentSymptomId ||
            (this.getState().entities.length
                ? this.getState().entities[0].id
                : null)
        );
    };

    /**
     * Get the identifier of the current symptom.
     * @return {[type]} [description]
     */
    getCurrentSymptom = () =>
        this.getById(this.getCurrentSymptomId());
}

export default new SymptomStore();
