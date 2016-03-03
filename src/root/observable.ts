import {toObservable, toDeepObservable} from '../observable/converters';
import d3bind from '../root';


d3bind.observable = function(object: any) {
    return toObservable(object);
};

d3bind.deepObservable = function(object: any) {
    return toDeepObservable(object);
};
