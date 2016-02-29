import Observable, {WritableObservable} from "./observable/observable";
import ObservableArray from "./observable/array";
import {Primitive} from './utils/types';
import {BindRepeatRenderer, BindRepeatOptions} from './repeat/bind-repeat';
import {BindingTransition} from './bindings/selector';


export type D3Selector = d3.Selection<any>;

export interface D3BindSelector extends D3Selector {

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
    remove(unbind?: boolean): D3BindSelector,


    bindText(observable: Observable<string>, transition?: BindingTransition): D3BindSelector;
    bindText<T>(observable: Observable<T>, converter: (input: T) => string, transition?: BindingTransition): D3BindSelector;
    bindText(observable: Observable<any>[], converter: (...params: any[]) => string, transition?: BindingTransition): D3BindSelector;
    unbindText(): D3BindSelector;

    bindHtml(observable: Observable<string>): D3BindSelector;
    bindHtml<T>(observable: Observable<T>, converter: (input: T) => string): D3BindSelector;
    bindHtml(observable: Observable<any>[], converter: (...params: any[]) => string): D3BindSelector;
    unbindHtml(): D3BindSelector;

    bindClassed(className: string, observable: Observable<boolean>): D3BindSelector,
    bindClassed<T>(className: string, observable: Observable<T>, converter: (input: T) => boolean): D3BindSelector,
    bindClassed(className: string, observable: Observable<any>[], converter: (...params: any[]) => boolean): D3BindSelector;
    unbindClassed(className: string): D3BindSelector;

    bindStyle(styleName: string, observable: Observable<Primitive>, transition?: BindingTransition): D3BindSelector,
    bindStyle<T>(styleName: string, observable: Observable<T>, converter: (input: T) => Primitive, transition?: BindingTransition): D3BindSelector,
    bindStyle(styleName: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive, transition?: BindingTransition): D3BindSelector;
    unbindStyle(styleName: string): D3BindSelector;

    bindAttr(attr: string, observable: Observable<Primitive>, transition?: BindingTransition): D3BindSelector,
    bindAttr<T>(attr: string, observable: Observable<T>, converter: (input: T) => Primitive, transition?: BindingTransition): D3BindSelector,
    bindAttr(attr: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive, transition?: BindingTransition): D3BindSelector;
    unbindAttr(attr: string): D3BindSelector;

    bindProperty(property: string, observable: Observable<Primitive>): D3BindSelector,
    bindProperty<T>(property: string, observable: Observable<T>, converter: (input: T) => Primitive): D3BindSelector,
    bindProperty(property: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive): D3BindSelector;
    unbindProperty(property: string): D3BindSelector;

    bindCall(observable: Observable<any>, func: (selector: D3BindSelector) => void): D3BindSelector;
    bindCall(observable: Observable<any>[], func: (selector: D3BindSelector) => void): D3BindSelector;
    unbindCall(func: (selector: D3BindSelector) => void): D3BindSelector;

    bindInput(observable: WritableObservable<Primitive>): D3BindSelector
    unbindInput(): D3BindSelector;

    repeat<T>(modelList: ArrayLike<T>, renderer: (modelItem: T, index: number, parent: D3BindSelector) => void): D3BindSelector,
    bindRepeat<T>(modelList: ObservableArray<T>, renderer: BindRepeatRenderer<T>, options?: BindRepeatOptions): D3BindSelector,
    unbindRepeat(): D3BindSelector;

    bindRedraw<T>(observable: Observable<T>, renderer: (model: T, parent: D3BindSelector) => void): D3BindSelector;
    bindRedraw(observable: Observable<any>[], renderer: (...params: any[]) => void): D3BindSelector;
    unbindRedraw(): D3BindSelector;

    unbind(descendants?: boolean): D3BindSelector;
}

const d3bindSelector: D3BindSelector = <D3BindSelector>{};
export default d3bindSelector;
