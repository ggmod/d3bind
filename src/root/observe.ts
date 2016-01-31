import ObservableProperty from "../observable/property";
import ObservableList from '../observable/list';
import d3bind from '../root';


d3bind.observe = function(object: any) {
    if (Array.isArray(object)) {
        return ObservableList.of(object);
    } else {
        for (var key in object) {
            new ObservableProperty(object, key);
        }
        return object;
    }
};
