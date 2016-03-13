import {subscribe} from '../observable/helpers';
import Observable from "../observable/observable";
import selection, {D3BindSelection, D3Transition} from "../selection";
import {setUnbindForSelectionField, unbindSelectionField} from '../bindings/unbind';
import {BindingTransition, getTransitionSelection} from '../bindings/selection';
import Logger from '../utils/logger';


const BIND_CALL_ID = 'd3bind_bindCall_id';
var bindCallSequence = 0;

function getFuncId(func: any) {
    return func[BIND_CALL_ID];
}

function setFuncId(func: any) {
    if (func[BIND_CALL_ID] === undefined) {
        func[BIND_CALL_ID] = bindCallSequence++; // TODO find an alternative solution for identifying the function
    }
}

function bindCall(observable: Observable<any>, func: (selection: D3BindSelection) => void): D3BindSelection;
function bindCall(observable: Observable<any>[], func: (selection: D3BindSelection) => void): D3BindSelection;
function bindCall(observable: Observable<any>, func: (selection: D3Transition) => void, transition: BindingTransition): D3BindSelection;
function bindCall(observable: Observable<any>[], func: (selection: D3Transition) => void, transition: BindingTransition): D3BindSelection;
function bindCall(observable: any, func: (selection: any) => void, transition?: BindingTransition): D3BindSelection {

    var logger = Logger.get('Selection', 'call' + ((<any>func).name ? (':' + (<any>func).name) : ''));

    setFuncId(func);

    this.call(func);

    var unsubscribeFunc = subscribe(observable, () => null, (newValue, oldValue, caller) => {
        var _selection = getTransitionSelection(this, transition, 'call:' + getFuncId(func));

        logger.log('caller:', caller, '| node:', this.node());
        (<any>_selection).call(func); // why can't TS compile this?
    });

    setUnbindForSelectionField(this, 'call:' + getFuncId(func), unsubscribeFunc);

    return this;
}
selection.bindCall = bindCall;


function unbindCall(func: (selection: D3BindSelection) => void): D3BindSelection;
function unbindCall(func: (selection: D3Transition) => void): D3BindSelection;
function unbindCall(func: (selection: any) => void): D3BindSelection {
    unbindSelectionField(this, 'call:' + getFuncId(func));
    return this;
}
selection.unbindCall = unbindCall;
