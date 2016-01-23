import selectorTemplate from './selector';
import {D3BindSelector} from "./selector";
import Selection = d3.Selection;


export function addBindingFunctionsToSelector(d3selector: Selection<any>): D3BindSelector {
    var d3bindSelector: D3BindSelector = Object.create(d3selector);
    for (let key in selectorTemplate) {
        d3bindSelector[key] = selectorTemplate[key];
    }
    return d3bindSelector;
}
