import {bind} from '../bindings/helpers';
import Observable from "../observable/observable";
import selector, {D3BindSelector} from "../selector";
import {Primitive} from '../utils';


function bindText(observable: Observable<string>): D3BindSelector;
function bindText<T>(observable: Observable<T>, converter: (input: T) => string): D3BindSelector;
function bindText(observable: Observable<any>[], converter: (...params: any[]) => string): D3BindSelector;
function bindText(observable: any, converter?: any): D3BindSelector {
    bind(observable, converter, (value: string) => {
        this.text(value);
    });
    return this;
}
selector.bindText = bindText;

function bindHtml(observable: Observable<string>): D3BindSelector;
function bindHtml<T>(observable: Observable<T>, converter: (input: T) => string): D3BindSelector;
function bindHtml(observable: Observable<any>[], converter: (...params: any[]) => string): D3BindSelector;
function bindHtml(observable: any, converter?: any): D3BindSelector {
    bind(observable, converter, (value: string) => {
        this.html(value);
    });
    return this;
}
selector.bindHtml = bindHtml;

function bindClassed(className: string, observable: Observable<string>): D3BindSelector;
function bindClassed<T>(className: string, observable: Observable<T>, converter?: (input: T) => boolean): D3BindSelector;
function bindClassed(className: string, observable: Observable<any>[], converter: (...params: any[]) => boolean): D3BindSelector;
function bindClassed(className: string, observable: any, converter?: any): D3BindSelector {
    bind(observable, converter, (value: boolean) => {
        this.classed(className, value);
    });
    return this;
}
selector.bindClassed = bindClassed;

function bindStyle(styleName: string, observable: Observable<Primitive>): D3BindSelector;
function bindStyle<T>(styleName: string, observable: Observable<T>, converter?: (input: T) => Primitive): D3BindSelector;
function bindStyle(styleName: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive): D3BindSelector;
function bindStyle(styleName: string, observable: any, converter?: any): D3BindSelector {
    bind(observable, converter, (value: Primitive) => {
        this.style(styleName, value);
    });
    return this;
}
selector.bindStyle = bindStyle;

function bindAttr(attr: string, observable: Observable<Primitive>): D3BindSelector;
function bindAttr<T>(attr: string, observable: Observable<T>, converter?: (input: T) => Primitive): D3BindSelector;
function bindAttr(attr: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive): D3BindSelector;
function bindAttr(attr: string, observable: any, converter?: any): D3BindSelector {
    bind(observable, converter, (value: Primitive) => {
        this.attr(attr, value);
    });
    return this;
}
selector.bindAttr = bindAttr;

function bindProperty(property: string, observable: Observable<Primitive>): D3BindSelector;
function bindProperty<T>(property: string, observable: Observable<T>, converter?: (input: T) => Primitive): D3BindSelector;
function bindProperty(property: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive): D3BindSelector;
function bindProperty(property: string, observable: any, converter?: any): D3BindSelector {
    bind(observable, converter, (value: Primitive) => {
        this.property(property, value);
    });
    return this;
}
selector.bindProperty = bindProperty;
