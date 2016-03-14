import Observable, {WritableObservable} from "./observable/observable";
import ObservableArray from "./observable/array";
import {Primitive} from './utils/types';
import {BindRepeatRenderer, BindRepeatOptions} from './repeat/bind-repeat';
import {BindingTransition} from './bindings/selection';


export type D3Selection = d3.Selection<any>;
export type D3Transition = d3.Transition<any>;

export interface D3BindSelection extends D3Selection {

    select(selectorText: string): D3BindSelection,
    select(func: () => EventTarget): D3BindSelection,
    selectAll(selectorText: string): D3BindSelection,
    selectAll(func: () => EventTarget[]): D3BindSelection,
    filter(selector: string): D3BindSelection;
    filter(selector: () => boolean): D3BindSelection;

    transition(name?: string): D3BindTransition;

    append(tagName: string): D3BindSelection,
    append(func: () => EventTarget): D3BindSelection,
    insert(tagName: string, before: string): D3BindSelection,
    insert(tagName: string, before: () => EventTarget): D3BindSelection,
    insert(func: () => EventTarget, before: string): D3BindSelection,
    insert(func: () => EventTarget, before: () => EventTarget): D3BindSelection,
    remove(keepBindings?: boolean): D3BindSelection,

    bindText(observable: Observable<string>, transition?: BindingTransition): D3BindSelection;
    bindText<T>(observable: Observable<T>, converter: (input: T) => string, transition?: BindingTransition): D3BindSelection;
    bindText(observable: Observable<any>[], converter: (...params: any[]) => string, transition?: BindingTransition): D3BindSelection;
    unbindText(): D3BindSelection;

    bindHtml(observable: Observable<string>): D3BindSelection;
    bindHtml<T>(observable: Observable<T>, converter: (input: T) => string): D3BindSelection;
    bindHtml(observable: Observable<any>[], converter: (...params: any[]) => string): D3BindSelection;
    unbindHtml(): D3BindSelection;

    bindClassed(className: string, observable: Observable<boolean>): D3BindSelection,
    bindClassed<T>(className: string, observable: Observable<T>, converter: (input: T) => boolean): D3BindSelection,
    bindClassed(className: string, observable: Observable<any>[], converter: (...params: any[]) => boolean): D3BindSelection;
    unbindClassed(className: string): D3BindSelection;

    bindStyle(styleName: string, observable: Observable<Primitive>, transition?: BindingTransition): D3BindSelection,
    bindStyle<T>(styleName: string, observable: Observable<T>, converter: (input: T) => Primitive, transition?: BindingTransition): D3BindSelection,
    bindStyle(styleName: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive, transition?: BindingTransition): D3BindSelection;
    unbindStyle(styleName: string): D3BindSelection;

    bindAttr(attr: string, observable: Observable<Primitive>, transition?: BindingTransition): D3BindSelection,
    bindAttr<T>(attr: string, observable: Observable<T>, converter: (input: T) => Primitive, transition?: BindingTransition): D3BindSelection,
    bindAttr(attr: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive, transition?: BindingTransition): D3BindSelection;
    unbindAttr(attr: string): D3BindSelection;

    bindProperty(property: string, observable: Observable<Primitive>): D3BindSelection,
    bindProperty<T>(property: string, observable: Observable<T>, converter: (input: T) => Primitive): D3BindSelection,
    bindProperty(property: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive): D3BindSelection;
    unbindProperty(property: string): D3BindSelection;

    bindCall(observable: Observable<any>, func: (selection: D3BindSelection) => void): D3BindSelection;
    bindCall(observable: Observable<any>[], func: (selection: D3BindSelection) => void): D3BindSelection;
    bindCall(observable: Observable<any>, func: (selection: D3Transition) => void, transition: BindingTransition): D3BindSelection;
    bindCall(observable: Observable<any>[], func: (selection: D3Transition) => void, transition: BindingTransition): D3BindSelection;
    unbindCall(func: (selection: D3BindSelection) => void): D3BindSelection;
    unbindCall(func: (selection: D3Transition) => void): D3BindSelection;

    bindInput(observable: WritableObservable<Primitive>): D3BindSelection
    unbindInput(): D3BindSelection;

    repeat<T>(modelList: ArrayLike<T>, renderer: (modelItem: T, index: number, parent: D3BindSelection) => void): D3BindSelection,
    bindRepeat<T>(modelList: ObservableArray<T>, renderer: BindRepeatRenderer<T>, options?: BindRepeatOptions<T>): D3BindSelection,
    unbindRepeat(): D3BindSelection;

    bindRedraw<T>(observable: Observable<T>, renderer: (model: T, parent: D3BindSelection) => void): D3BindSelection;
    bindRedraw(observable: Observable<any>[], renderer: (...params: any[]) => void): D3BindSelection;
    unbindRedraw(): D3BindSelection;

    bind<T>(observable: Observable<T>, func: (model: T, parent: D3BindSelection) => void): D3BindSelection;
    bind(observable: Observable<any>[], func: (...params: any[]) => void): D3BindSelection;
    unbind<T>(func: (model: T, parent: D3BindSelection) => void): D3BindSelection;
    unbind(func: (...params: any[]) => void): D3BindSelection;

    unbindAll(descendants?: boolean): D3BindSelection;
}

export interface D3BindTransition extends D3Transition {
    remove(keepBindings?: boolean): D3BindTransition;

    transition(): D3BindTransition;

    select(selectorText: string): D3BindTransition,
    select(func: () => EventTarget): D3BindTransition,
    selectAll(selectorText: string): D3BindTransition,
    selectAll(func: () => EventTarget[]): D3BindTransition,
    filter(selector: string): D3BindTransition;
    filter(selector: () => boolean): D3BindTransition;
}

const selectionTemplate: D3BindSelection = <D3BindSelection>{};
export default selectionTemplate;
