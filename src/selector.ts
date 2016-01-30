import Observable from "./observable/observable";
import Selection = d3.Selection;


export type D3Selector = d3.Selection<any>;

export interface D3BindSelector extends D3Selector {

    bindText(observable: Observable<string>): D3BindSelector;
    bindText<T>(observable: Observable<T>, converter: (input: T) => string): D3BindSelector;
    bindText(observable: Observable<any>[], converter: (...params: any[]) => string): D3BindSelector;

    bindHtml(observable: Observable<string>): D3BindSelector;
    bindHtml<T>(observable: Observable<T>, converter: (input: T) => string): D3BindSelector;
    bindHtml(observable: Observable<any>[], converter: (...params: any[]) => string): D3BindSelector;

    bindClassed(className: string, observable: Observable<boolean>): D3BindSelector,
    bindClassed<T>(className: string, observable: Observable<T>, converter: (input: T) => boolean): D3BindSelector,
    bindClassed(className: string, observable: Observable<any>[], converter: (...params: any[]) => boolean): D3BindSelector;

    bindStyle(styleName: string, observable: Observable<string | number>): D3BindSelector,
    bindStyle<T>(styleName: string, observable: Observable<T>, converter: (input: T) => string | number): D3BindSelector,
    bindStyle(styleName: string, observable: Observable<any>[], converter: (...params: any[]) => string | number): D3BindSelector;

    bindAttr(attr: string, observable: Observable<string>): D3BindSelector,
    bindAttr<T>(attr: string, observable: Observable<T>, converter: (input: T) => string): D3BindSelector,
    bindAttr(attr: string, observable: Observable<any>[], converter: (...params: any[]) => string): D3BindSelector;

    bindProperty(property: string, observable: Observable<any>): D3BindSelector,
    bindProperty<T>(property: string, observable: Observable<T>, converter: (input: T) => any): D3BindSelector,
    bindProperty(property: string, observable: Observable<any>[], converter: (...params: any[]) => any): D3BindSelector;

    bindCall(observable: Observable<any> | Observable<any>[], func: (selector: D3BindSelector) => void): D3BindSelector;

    select(selectorText: string): D3BindSelector,
    select(func: () => EventTarget): D3BindSelector,
    selectAll(selectorText: string): D3BindSelector,
    selectAll(func: () => EventTarget[]): D3BindSelector,

    append(tagName: string): D3BindSelector,
    append(func: () => EventTarget): D3BindSelector,
    insert(tagName: string, before: string): D3BindSelector,
    insert(tagName: string, before: () => EventTarget): D3BindSelector,
    insert(func: () => EventTarget, before: string): D3BindSelector,
    insert(func: () => EventTarget, before: () => EventTarget): D3BindSelector,
    remove(): D3BindSelector
}

const d3bindSelector: D3BindSelector = <D3BindSelector>{};
export default d3bindSelector;
