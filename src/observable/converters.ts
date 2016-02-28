import ObservableProperty from "./property";
import ObservableArray from './array';
import ObservableValue from './value';


function isSingleValue(value: any) {
    if(value === undefined || value === null
        || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
        || value.constructor === Number || value.constructor === String || value.constructor === Boolean
        || value instanceof RegExp) {
        return true;
    }
    return false;
}

export function toObservable(object: any) {
    if (Array.isArray(object)) {
        return new ObservableArray(object);
    } else if(isSingleValue(object)) {
        return new ObservableValue(object);
    } else {
        for (var key in object) {
            ObservableProperty.on(object, key);
        }
        return object;
    }
}

export function toDeepObservable(object: any) {
    if (Array.isArray(object)) {
        var obsItems = object.map((item: any) => toDeepObservable(item));
        return new ObservableArray(obsItems);
    } else if(isSingleValue(object)) {
        return object;
    } else {
        for (var key in object) {
            object[key] = toDeepObservable(object[key]);
            ObservableProperty.on(object, key);
        }
        return object;
    }
}
