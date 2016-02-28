import {toObservable, toDeepObservable} from '../observable/converters';
import d3bind from '../root';


d3bind.observe = function(object: any) {
    return toObservable(object);
};

d3bind.deepObserve = function(object: any) {
    return toDeepObservable(object);
};
