import {override, addBindingFunctionsToSelector} from './override-utils';
import selector, {D3Selector, D3BindSelector} from "../selector";


function append(func: () => EventTarget): D3BindSelector;
function append(tagName: string): D3BindSelector;
function append(param: any) {
    return override(this, _super => _super.append(param));
}
selector.append = append;


function insert(tagName: string, before?: string): D3BindSelector;
function insert(tagName: string, before?: () => EventTarget): D3BindSelector;
function insert(func: () => EventTarget, before?: string): D3BindSelector;
function insert(func: () => EventTarget, before?: () => EventTarget): D3BindSelector;
function insert(param: any, before?: any): D3BindSelector {
    return override(this, _super => _super.insert(param, before));
}
selector.insert = insert;


function select(func: () => EventTarget): D3BindSelector;
function select(selectorText: string): D3BindSelector;
function select(param: any): D3BindSelector {
    return override(this, _super => _super.select(param));
}
selector.select = select;


function selectAll(func: () => EventTarget[]): D3BindSelector;
function selectAll(selectorText: string): D3BindSelector;
function selectAll(param: any): D3BindSelector {
    return override(this, _super => _super.selectAll(param));
}
selector.selectAll = selectAll;


selector.remove = function(): D3BindSelector {
    var _super: D3Selector = Object.getPrototypeOf(this);
    _super.remove(); // detaches it from the DOM
    // TODO: unbind
    return this;
};
