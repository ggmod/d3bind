import {subscribe} from '../bindings/helpers';
import Observable from "../observable/observable";
import selector, {D3BindSelector} from "../selector";


function bindCall(observable: Observable<any> | Observable<any>[], func: (selector: D3BindSelector) => void): D3BindSelector {
    this.call(func);
    subscribe(observable, () => {
        this.call(func);
    });
    return this;
}
selector.bindCall = bindCall;
