import {override, addBindingFunctionsToSelection} from './override-utils';
import selection, {D3Selection, D3BindSelection} from "../selection";
import {unbindSelection} from '../bindings/unbind';


function append(func: () => EventTarget): D3BindSelection;
function append(tagName: string): D3BindSelection;
function append(param: any) {
    return override(this, _super => _super.append(param));
}
selection.append = append;


function insert(tagName: string, before?: string): D3BindSelection;
function insert(tagName: string, before?: () => EventTarget): D3BindSelection;
function insert(func: () => EventTarget, before?: string): D3BindSelection;
function insert(func: () => EventTarget, before?: () => EventTarget): D3BindSelection;
function insert(param: any, before?: any): D3BindSelection {
    return override(this, _super => _super.insert(param, before));
}
selection.insert = insert;


function select(func: () => EventTarget): D3BindSelection;
function select(selectorText: string): D3BindSelection;
function select(param: any): D3BindSelection {
    return override(this, _super => _super.select(param));
}
selection.select = select;


function selectAll(func: () => EventTarget[]): D3BindSelection;
function selectAll(selectorText: string): D3BindSelection;
function selectAll(param: any): D3BindSelection {
    return override(this, _super => _super.selectAll(param));
}
selection.selectAll = selectAll;


selection.remove = function(unbind = true): D3BindSelection {
    var _super: D3Selection = Object.getPrototypeOf(this);
    _super.remove(); // detaches it from the DOM

    if (unbind) {
        unbindSelection(this, true);
    }

    return this;
};
