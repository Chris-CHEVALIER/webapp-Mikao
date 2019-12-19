import EntityStoreBase from "stores/EntityStoreBase";
import TreatmentConstants from "constants/TreatmentConstants";

class TreatmentStore extends EntityStoreBase {
    getInitialState() {
        return {
            currentTreatmentId: null,
            entities: [],
        };
    }

    reduce(state, action) {
        const { type, payload } = action;
        let newState = Object.assign({}, state);
        switch (type) {
            case TreatmentConstants.RECEIVE_TREATMENT:
                newState = this._receiveEntity(state, payload.treatment);
                break;
            case TreatmentConstants.RECEIVE_TREATMENTS:
                newState = this._receiveMany(state, payload.treatments);
                break;
            case TreatmentConstants.CHANGE_CURRENT_TREATMENT:
                newState.currentTreatmentId = payload.treatmentId;
                break;
            case "clearAll":
                newState = this.getInitialState();
                break;
            default:
                newState = state;
        }
        return newState;
    }

    _receiveMany = (state, treatments) => {
        let newState = Object.assign({}, state);
        // We remove all the entities that have the same ID as the new treatments
        newState.entities = state.entities.filter(
            e => treatments.findIndex(a => e.id === a.id) === -1
        );
        newState.entities.push(...treatments);
        return newState;
    };

    ///// Public Methods  /////
    getTreatment() {
        return this.getState().treatment;
    }

    /**
     * Get a treatment by ID.
     * @param {number} id The identifier.
     * @return {?Treatment}    The treatment, or NULL if no entity is found.
     */
    getById = (id) => {
        return this.getState().entities.find(e => e.id === id);
    };

    /**
     * Get treatments.
     */
    getTreatments = () =>  {
        return this.getState().entities;
    }

    /**
     * Get the identifier of the current treatment.
     * @return {[type]} [description]
     */
    getCurrentTreatmentId = () => {
        return (
            this.getState().currentTreatmentId ||
            (this.getState().entities.length
                ? this.getState().entities[0].id
                : null)
        );
    };

    /**
     * Get the identifier of the current treatment.
     * @return {[type]} [description]
     */
    getCurrentTreatment = () =>
        this.getById(this.getCurrentTreatmentId());
}

export default new TreatmentStore();
