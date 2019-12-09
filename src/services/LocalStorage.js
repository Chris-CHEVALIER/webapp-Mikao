const LocalStorage = {
    removeItem(key) {
        return new Promise((
            resolve,
        ) => {
            localStorage.removeItem(key);
            resolve();
        });
    },

    setItem(key, value) {
        return new Promise((
            resolve,
        ) => {
            localStorage.setItem(key, value);
            resolve();
        });
    },

    getItem(key) {
        return new Promise((
            resolve,
        ) => {
            const value = localStorage.getItem(key);
            resolve(value);
        });
    }
};

export default LocalStorage;
