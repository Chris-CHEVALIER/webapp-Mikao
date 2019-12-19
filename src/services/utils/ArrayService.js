export default class ArrayService {
    static unique(array) {
        const n = {};
        const r = [];
        for (let i = 0; i < array.length; i++) {
            if (!n[array[i]]) {
                n[array[i]] = true;
                r.push(array[i]);
            }
        }
        return r;
    }

    static uniqueEntity(array) {
        const n = {};
        const r = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i]) {
                const { id } = array[i];
                if (!n[id]) {
                    n[id] = true;
                    r.push(array[i]);
                }
            }
        }
        return r;
    }
}
