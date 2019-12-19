export default class FilterService {
  static matchFilter(filter, value, compareFunction) {
    if (!filter || filter.length === 0) {
      return true;
    }
    if (!compareFunction) {
      compareFunction = (v1, v2) => v1 == v2;
    }

    let match;
    if (Array.isArray(value)) {
      match = value.some(r => compareFunction(r, filter));
    } else if (Array.isArray(filter)) {
      match = filter.indexOf(value) !== -1;
    } else {
      match = filter.toString() === value.toString();
    }

    return match;
  }
}
