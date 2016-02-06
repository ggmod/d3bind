import ObservableProperty from "../observable/property";
import ObservableList from '../observable/list';
import ObservableValue from '../observable/value';
import d3bind from '../root';


function isSingleValue(value: any) {
    if(value === undefined || value === null
        || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
        || value.constructor === Number || value.constructor === String || value.constructor === Boolean
        || value instanceof RegExp) {
        return true;
    }
    return false;
}

function toObservable(object: any) {
    if (Array.isArray(object)) {
        return ObservableList.of(object);
    } else if(isSingleValue(object)) {
        return new ObservableValue(object);
    } else {
        for (var key in object) {
            new ObservableProperty(object, key);
        }
        return object;
    }
}

function toDeepObservable(object: any) {
    if (Array.isArray(object)) {
        var obsItems = object.map((item: any) => toDeepObservable(item));
        return ObservableList.of(obsItems);
    } else if(isSingleValue(object)) {
        return object;
    } else {
        for (var key in object) {
            object[key] = toDeepObservable(object[key]);
            new ObservableProperty(object, key);
        }
        return object;
    }
}

d3bind.observe = function(object: any) {
    return toObservable(object);
};

d3bind.deepObserve = function(object: any) {
    return toDeepObservable(object);
};
