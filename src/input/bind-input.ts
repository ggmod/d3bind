import {bind} from '../bindings/selector';
import {WritableObservable} from "../observable/observable";
import selector, {D3BindSelector} from "../selector";
import {Primitive} from '../utils';
import {unbindSelectorField} from '../bindings/unbind';


const EVENT_NAMESPACE = '.d3bind_input';

function bindInput(observable: WritableObservable<Primitive>): D3BindSelector {

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
selector.bindInput = bindInput;


selector.unbindInput = function(): D3BindSelector {
    unbindSelectorField(this, 'input');

    var eventName = this.property('type') === 'checkbox' ? 'change' : 'input';
    this.on(eventName + EVENT_NAMESPACE, null);

    return this;
};
