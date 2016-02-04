import {bind} from '../bindings/helpers';
import {WritableObservable} from "../observable/observable";
import selector, {D3BindSelector} from "../selector";


function bindInput(observable: WritableObservable<any>): D3BindSelector {

    var self = this;
    var propertyName = this.property('type') === 'checkbox' ? 'checked' : 'value';
    var eventName = this.property('type') === 'checkbox' ? 'change' : 'input';

    bind(observable, null, (value: any, caller: any) => {
        if (caller !== this) { // avoid "echo"
            this.property(propertyName, value);
        }
    });

    this.on(eventName, function() {
        observable.set(this[propertyName], false, self);
    });

    return this;
}
selector.bindInput = bindInput;
