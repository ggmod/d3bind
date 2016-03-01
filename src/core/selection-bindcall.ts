import {subscribe} from '../observable/helpers';
import Observable from "../observable/observable";
import selection, {D3BindSelection} from "../selection";
import {setUnbindForSelectionField, unbindSelectionField} from '../bindings/unbind';
import Logger from '../utils/logger';


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

function bindCall(observable: Observable<any>, func: (selection: D3BindSelection) => void): D3BindSelection;
function bindCall(observable: Observable<any>[], func: (selection: D3BindSelection) => void): D3BindSelection;
function bindCall(observable: any, func: (selection: D3BindSelection) => void): D3BindSelection {

    var logger = Logger.get('Selection', 'call');

    setFuncId(func);

    this.call(func);

    var unsubscribeFunc = subscribe(observable, () => null, (newValue, oldValue, caller) => {
        logger.log('caller:', caller);
        this.call(func);
    });

    setUnbindForSelectionField(this, 'call:' + getFuncId(func), unsubscribeFunc);

    return this;
}
selection.bindCall = bindCall;


selection.unbindCall = function(func: (selection: D3BindSelection) => void): D3BindSelection {
    unbindSelectionField(this, 'call:' + getFuncId(func));
    return this;
};
