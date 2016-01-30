import d3bind from '../root';
import {addBindingFunctionsToSelector} from "./override-utils";
import {D3BindSelector} from "../selector";


function select(selectorInput: string): D3BindSelector ;
function select(selectorInput: EventTarget): D3BindSelector;
function select(selectorInput: any): D3BindSelector {
    var selector = d3.select(selectorInput);
    return addBindingFunctionsToSelector(selector);
}
d3bind.select = select;


function selectAll(selectorInput: string): D3BindSelector;
function selectAll(selectorInput: EventTarget[]): D3BindSelector;
function selectAll(selectorInput: any): D3BindSelector {
    var selector = d3.selectAll(selectorInput);
    return addBindingFunctionsToSelector(selector);
}
d3bind.selectAll = selectAll;


function selection(): D3BindSelector {
    var selector = d3.selection();
    return addBindingFunctionsToSelector(selector);
}
d3bind.selection = selection;
