import {subscribe} from '../observable/helpers';
import Observable from "../observable/observable";
import selection, {D3BindSelection, D3Transition} from "../selection";
import {setUnbindForSelectionField, unbindSelectionField} from '../bindings/unbind';
import {BindingTransition, getTransitionSelection} from '../bindings/selection';
import Logger from '../utils/logger';

// TODO refactor with bindCall and bindRedraw
// and find an alternative solution for identifying the function for both

const CUSTOM_BIND_ID = 'd3bind_custom_bind_id';
var customBindSequence = 0;

function getFuncId(func: any) {
    return func[CUSTOM_BIND_ID];
}

function setFuncId(func: any) {
    if (func[CUSTOM_BIND_ID] === undefined) {
        func[CUSTOM_BIND_ID] = customBindSequence++;
    }
}

function applyFunc<T>(selection: D3BindSelection, observable: Observable<T>, func: (model: T, parent: D3BindSelection) => void): void;
function applyFunc(selection: D3BindSelection, observable: Observable<any>[], func: (...params: any[]) => void): void;
function applyFunc(selection: D3BindSelection, observable: any, func: () => void): void {

    if (observable instanceof Array) {
        func.apply(selection, observable.map((item: Observable<any>) => item.get()).concat(selection));
    } else {
        func.call(selection, observable.get(), selection);
    }
}

function bind<T>(observable: Observable<any>, func: (model: T, parent: D3BindSelection) => void): D3BindSelection;
function bind(observable: Observable<any>[], func: (...params: any[]) => void): D3BindSelection;
function bind(observable: any, func: () => void): D3BindSelection {

    var logger = Logger.get('Selection', 'custom' + ((<any>func).name ? (':' + (<any>func).name) : ''));

    setFuncId(func);

    applyFunc(this, observable, func);

    var unsubscribeFunc = subscribe(observable, () => null, (newValue, oldValue, caller) => {
        logger.log('caller:', caller);
        applyFunc(this, observable, func);
    });

    setUnbindForSelectionField(this, 'custom:' + getFuncId(func), unsubscribeFunc);

    return this;
}
selection.bind = bind;


function unbind<T>(func: (model: T, parent: D3BindSelection) => void): D3BindSelection;
function unbind(func: (...params: any[]) => void): D3BindSelection;
function unbind(func: () => void): D3BindSelection {
    unbindSelectionField(this, 'custom:' + getFuncId(func));
    return this;
}
selection.unbind = unbind;
