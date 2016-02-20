import {subscribe} from '../bindings/helpers';
import Observable from "../observable/observable";
import selector, {D3BindSelector} from "../selector";
import {setUnbindForSelectorField, unbindSelectorField} from '../bindings/unbind';


const BIND_CALL_ID = 'd3bind_bindCall_id';
var bindCallSequence = 0;

function getFuncId(func: any) {
    return func[BIND_CALL_ID];
}

function setFuncId(func: any) {
    if (func[BIND_CALL_ID] === undefined) {
        func[BIND_CALL_ID] = bindCallSequence++; // TODO find an alternative solution for identifying the function at unbind
    }
}


function bindCall(observable: Observable<any> | Observable<any>[], func: (selector: D3BindSelector) => void): D3BindSelector {

    setFuncId(func);

    this.call(func);

    var unsubscribeFunc = subscribe(observable, () => {
        this.call(func);
    });

    setUnbindForSelectorField(this, 'call:' + getFuncId(func), unsubscribeFunc);

    return this;
}
selector.bindCall = bindCall;


selector.unbindCall = function(func: (selector: D3BindSelector) => void): D3BindSelector {
    unbindSelectorField(this, 'call:' + getFuncId(func));
    return this;
};
