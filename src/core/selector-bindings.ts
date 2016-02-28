import {bind, bindWithTransition, BindingTransition} from '../bindings/selector';
import Observable from "../observable/observable";
import selector, {D3BindSelector} from "../selector";
import {Primitive} from '../utils/types';


function bindText(observable: Observable<string>, transition?: BindingTransition): D3BindSelector;
function bindText<T>(observable: Observable<T>, converter: (input: T) => string, transition?: BindingTransition): D3BindSelector;
function bindText(observable: Observable<any>[], converter: (...params: any[]) => string, transition?: BindingTransition): D3BindSelector;
function bindText(observable: any, converterOrTransition?: any, transition?: BindingTransition): D3BindSelector {
    var converter = typeof converterOrTransition === 'function' ? converterOrTransition : null;
    var transition: BindingTransition = typeof converterOrTransition === 'function' ? transition : converterOrTransition;

    bindWithTransition(this, 'text', observable, converter, transition, (selector: d3.Selection<any> | d3.Transition<any>, value: string) => {
        selector.text(value);
    });
    return this;
}
selector.bindText = bindText;

function bindHtml(observable: Observable<string>): D3BindSelector;
function bindHtml<T>(observable: Observable<T>, converter: (input: T) => string): D3BindSelector;
function bindHtml(observable: Observable<any>[], converter: (...params: any[]) => string): D3BindSelector;
function bindHtml(observable: any, converter?: any): D3BindSelector {
    bind(this, 'html', observable, converter, (value: string) => {
        this.html(value);
    });
    return this;
}
selector.bindHtml = bindHtml;

function bindClassed(className: string, observable: Observable<string>): D3BindSelector;
function bindClassed<T>(className: string, observable: Observable<T>, converter?: (input: T) => boolean): D3BindSelector;
function bindClassed(className: string, observable: Observable<any>[], converter: (...params: any[]) => boolean): D3BindSelector;
function bindClassed(className: string, observable: any, converter?: any): D3BindSelector {
    bind(this, 'classed:' + className, observable, converter, (value: boolean) => {
        this.classed(className, value);
    });
    return this;
}
selector.bindClassed = bindClassed;

function bindStyle(styleName: string, observable: Observable<Primitive>, transition?: BindingTransition): D3BindSelector;
function bindStyle<T>(styleName: string, observable: Observable<T>, converter?: (input: T) => Primitive, transition?: BindingTransition): D3BindSelector;
function bindStyle(styleName: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive, transition?: BindingTransition): D3BindSelector;
function bindStyle(styleName: string, observable: any, converterOrTransition?: any, transition?: BindingTransition): D3BindSelector {
    var converter = typeof converterOrTransition === 'function' ? converterOrTransition : null;
    var transition: BindingTransition = typeof converterOrTransition === 'function' ? transition : converterOrTransition;

    bindWithTransition(this, 'style:' + styleName, observable, converter, transition, (selector: d3.Selection<any> | d3.Transition<any>, value: Primitive) => {
        selector.style(styleName, value);
    });
    return this;
}
selector.bindStyle = bindStyle;

function bindAttr(attr: string, observable: Observable<Primitive>, transition?: BindingTransition): D3BindSelector;
function bindAttr<T>(attr: string, observable: Observable<T>, converter: (input: T) => Primitive, transition?: BindingTransition): D3BindSelector;
function bindAttr(attr: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive, transition?: BindingTransition): D3BindSelector;
function bindAttr(attr: string, observable: any, converterOrTransition?: any, transition?: BindingTransition): D3BindSelector {
    var converter = typeof converterOrTransition === 'function' ? converterOrTransition : null;
    var transition: BindingTransition = typeof converterOrTransition === 'function' ? transition : converterOrTransition;

    bindWithTransition(this, 'attr:' + attr, observable, converter, transition, (selector: d3.Selection<any> | d3.Transition<any>, value: Primitive) => {
        selector.attr(attr, value);
    });
    return this;
}
selector.bindAttr = bindAttr;

function bindProperty(property: string, observable: Observable<Primitive>): D3BindSelector;
function bindProperty<T>(property: string, observable: Observable<T>, converter?: (input: T) => Primitive): D3BindSelector;
function bindProperty(property: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive): D3BindSelector;
function bindProperty(property: string, observable: any, converter?: any): D3BindSelector {
    bind(this, 'property:' + property, observable, converter, (value: Primitive) => {
        this.property(property, value);
    });
    return this;
}
selector.bindProperty = bindProperty;
