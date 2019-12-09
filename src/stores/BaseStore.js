import { ReduceStore } from 'flux/utils';
import AppDispatcher from 'dispatchers/AppDispatcher';

/**
 * The Base Store from witch all stores must inherit.
 * It contains some utils methods to subscribe to actions and manage change events.
 */
export default class BaseStore extends ReduceStore {
    constructor() {
        super(AppDispatcher);
    }

    removeListener(callback) {
        return super.__emitter.removeListener(this.__changeEvent, callback);
    }
}
