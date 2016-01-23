import Observable from "./observable/observable";
import Selection = d3.Selection;


export interface D3BindSelector { // extends Selection<any> { // TODO incompatible override
    bindText<T>(observable: Observable<T>, converter?: (input: T) => string): D3BindSelector;
    bindText(observable: Observable<any>[], converter: (...params: any[]) => string): D3BindSelector;

    bindClassed<T>(className: string, property: Observable<T>, converter?: (input: T) => string): D3BindSelector,
    bindClassed(className: string, observable: Observable<any>[], converter: (...params: any[]) => string): D3BindSelector;

    append: (tagName: string) => D3BindSelector
}

const d3bindSelector: D3BindSelector = <D3BindSelector>{};
export default d3bindSelector;
