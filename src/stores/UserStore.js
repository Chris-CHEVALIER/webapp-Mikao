import EntityStoreBase from "stores/EntityStoreBase";
import UserConstants from "constants/UserConstants";

class UserStore extends EntityStoreBase {
    getInitialState() {
        return {
            currentUserId: null,
            entities: [],
        };
    }

    reduce(state, action) {
        const { type, payload } = action;
        let newState = Object.assign({}, state);
        switch (type) {
            case UserConstants.RECEIVE_USER:
                newState = this._receiveEntity(state, payload.user);
                break;
            case UserConstants.RECEIVE_USERS:
                newState = this._receiveMany(state, payload.users);
                break;
            case UserConstants.CHANGE_CURRENT_USER:
                newState.currentUserId = payload.userId;
                break;
            case "clearAll":
                newState = this.getInitialState();
                break;
            default:
                newState = state;
        }
        return newState;
    }

    _receiveMany = (state, users) => {
        let newState = Object.assign({}, state);
        // We remove all the entities that have the same ID as the new users
        newState.entities = state.entities.filter(
            e => users.findIndex(a => e.id === a.id) === -1
        );
        newState.entities.push(...users);
        return newState;
    };

    ///// Public Methods  /////
    getUser() {
        return this.getState().user;
    }

    /**
     * Get a user by ID.
     * @param {number} id The identifier.
     * @return {?User}    The user, or NULL if no entity is found.
     */
    getById = (id) => {
        return this.getState().entities.find(e => e.id === id);
    };

    /**
     * Get users.
     */
    getUsers = () =>  {
        return this.getState().entities;
    }

    /**
     * Get the identifier of the current user.
     * @return {[type]} [description]
     */
    getCurrentUserId = () => {
        return (
            this.getState().currentUserId ||
            (this.getState().entities.length
                ? this.getState().entities[0].id
                : null)
        );
    };

    /**
     * Get the identifier of the current user.
     * @return {[type]} [description]
     */
    getCurrentUser = () =>
        this.getById(this.getCurrentUserId());
}

export default new UserStore();
