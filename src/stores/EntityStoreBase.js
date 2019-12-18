import BaseStore from "stores/BaseStore";

/**
 * A base store to manage entities (basically classes with an ID).
 * It contains all the basic actions (e.g. Receive one entity, Receive all entities, Delete an entity, etc.)
 */
export default class EntityStoreBase extends BaseStore {
    getInitialState() {
        return {
            entities: []
        };
    }

    _receiveEntity = (state, entity) => {
        let newState = Object.assign({}, state);
        newState.entities = state.entities.slice();

        const i = newState.entities.findIndex(f => f.id === entity.id);
        if (i > -1) {
            newState.entities[i] = entity;
        } else {
            newState.entities.push(entity);
        }
        return newState;
    };

    _receiveAllEntities = (state, entities) => {
        let newState = Object.assign({}, state);
        newState.entities = entities;
        return newState;
    };

    _receiveSomeEntities = (state, entities) => {
        let newState = Object.assign({}, state);
        newState.entities = state.entities.slice();

        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            const index = newState.entities.findIndex(
                e => e && e.id === entity.id
            );
            if (index > -1) {
                newState.entities[index] = entity;
            } else {
                newState.entities.push(entity);
            }
        }
        return newState;
    };

    _deleteEntity = (id, state) => {
        let newState = Object.assign({}, state);
        newState.entities = state.entities.slice();
        const i = newState.entities.findIndex(e => e.id === id);
        if (i > -1) {
            newState.entities.splice(i, 1);
        }
        return newState;
    };
}
