import ObservableProperty from "../observable/property";
import d3bind from '../root';


d3bind.observe = function(object) {
    for (var key in object) {
        new ObservableProperty(object, key);
    }
    return object;
};
