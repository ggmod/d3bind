import selectionTemplate from '../selection';
import {D3Selection, D3BindSelection} from "../selection";


export function addBindingFunctionsToSelection(d3selection: D3Selection): D3BindSelection {
    var d3bindSelection: D3BindSelection = Object.create(d3selection);
    for (let key in selectionTemplate) {
        d3bindSelection[key] = selectionTemplate[key];
    }
    return d3bindSelection;
}

export function override(selection: D3BindSelection, func: (_super: D3Selection) => D3Selection) {
    var _super: D3Selection = Object.getPrototypeOf(selection);
    var newSelection: D3Selection = func(_super);
    return addBindingFunctionsToSelection(newSelection);
}
