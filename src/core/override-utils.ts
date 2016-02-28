import selectorTemplate from '../selector';
import {D3Selector, D3BindSelector} from "../selector";


export function addBindingFunctionsToSelector(d3selector: D3Selector): D3BindSelector {
    var d3bindSelector: D3BindSelector = Object.create(d3selector);
    for (let key in selectorTemplate) {
        d3bindSelector[key] = selectorTemplate[key];
    }
    return d3bindSelector;
}

export function override(selector: D3BindSelector, func: (_super: D3Selector) => D3Selector) {
    var _super: D3Selector = Object.getPrototypeOf(selector);
    var newSelector: D3Selector = func(_super);
    return addBindingFunctionsToSelector(newSelector);
}
