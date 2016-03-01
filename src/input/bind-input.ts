import {bind} from '../bindings/selection';
import {WritableObservable} from "../observable/observable";
import selection, {D3BindSelection} from "../selection";
import {Primitive} from '../utils/types';
import {unbindSelectionField} from '../bindings/unbind';


const EVENT_NAMESPACE = '.d3bind_input';

function bindInput(observable: WritableObservable<Primitive>): D3BindSelection {

    var self = this;
    var propertyName = this.property('type') === 'checkbox' ? 'checked' : 'value';
    var eventName = this.property('type') === 'checkbox' ? 'change' : 'input';

    bind(this, 'input', observable, null, (value: any, caller: any) => {
        if (caller !== this) { // avoid "echo"
            this.property(propertyName, value);
        }
    });

    this.on(eventName + EVENT_NAMESPACE, function() {
        observable.set(this[propertyName], false, self);
    });

    return this;
}
selection.bindInput = bindInput;


selection.unbindInput = function(): D3BindSelection {
    unbindSelectionField(this, 'input');

    var eventName = this.property('type') === 'checkbox' ? 'change' : 'input';
    this.on(eventName + EVENT_NAMESPACE, null);

    return this;
};
