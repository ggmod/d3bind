import d3bind from '../root';
import {addBindingFunctionsToSelection} from "./override-utils";
import {D3BindSelection} from "../selection";


function select(selectorInput: string): D3BindSelection ;
function select(selectorInput: EventTarget): D3BindSelection;
function select(selectorInput: any): D3BindSelection {
    var selection = d3.select(selectorInput);
    return addBindingFunctionsToSelection(selection);
}
d3bind.select = select;


function selectAll(selectorInput: string): D3BindSelection;
function selectAll(selectorInput: EventTarget[]): D3BindSelection;
function selectAll(selectorInput: any): D3BindSelection {
    var selection = d3.selectAll(selectorInput);
    return addBindingFunctionsToSelection(selection);
}
d3bind.selectAll = selectAll;


function selection(): D3BindSelection {
    var selection = d3.selection();
    return addBindingFunctionsToSelection(selection);
}
d3bind.selection = selection;
