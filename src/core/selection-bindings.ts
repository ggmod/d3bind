import {bind, bindWithTransition, BindingTransition} from '../bindings/selection';
import Observable from "../observable/observable";
import selection, {D3BindSelection, D3Selection, D3Transition} from "../selection";
import {Primitive} from '../utils/types';


function bindText(observable: Observable<string>, transition?: BindingTransition): D3BindSelection;
function bindText<T>(observable: Observable<T>, converter: (input: T) => string, transition?: BindingTransition): D3BindSelection;
function bindText(observable: Observable<any>[], converter: (...params: any[]) => string, transition?: BindingTransition): D3BindSelection;
function bindText(observable: any, converterOrTransition?: any, transition?: BindingTransition): D3BindSelection {
    var converter = typeof converterOrTransition === 'function' ? converterOrTransition : null;
    var transition: BindingTransition = typeof converterOrTransition === 'function' ? transition : converterOrTransition;

    bindWithTransition(this, 'text', observable, converter, transition, (selection: D3Selection | D3Transition, value: string) => {
        selection.text(value);
    });
    return this;
}
selection.bindText = bindText;

function bindHtml(observable: Observable<string>): D3BindSelection;
function bindHtml<T>(observable: Observable<T>, converter: (input: T) => string): D3BindSelection;
function bindHtml(observable: Observable<any>[], converter: (...params: any[]) => string): D3BindSelection;
function bindHtml(observable: any, converter?: any): D3BindSelection {
    bind(this, 'html', observable, converter, (value: string) => {
        this.html(value);
    });
    return this;
}
selection.bindHtml = bindHtml;

function bindClassed(className: string, observable: Observable<string>): D3BindSelection;
function bindClassed<T>(className: string, observable: Observable<T>, converter?: (input: T) => boolean): D3BindSelection;
function bindClassed(className: string, observable: Observable<any>[], converter: (...params: any[]) => boolean): D3BindSelection;
function bindClassed(className: string, observable: any, converter?: any): D3BindSelection {
    bind(this, 'classed:' + className, observable, converter, (value: boolean) => {
        this.classed(className, value);
    });
    return this;
}
selection.bindClassed = bindClassed;

function bindStyle(styleName: string, observable: Observable<Primitive>, transition?: BindingTransition): D3BindSelection;
function bindStyle<T>(styleName: string, observable: Observable<T>, converter?: (input: T) => Primitive, transition?: BindingTransition): D3BindSelection;
function bindStyle(styleName: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive, transition?: BindingTransition): D3BindSelection;
function bindStyle(styleName: string, observable: any, converterOrTransition?: any, transition?: BindingTransition): D3BindSelection {
    var converter = typeof converterOrTransition === 'function' ? converterOrTransition : null;
    var transition: BindingTransition = typeof converterOrTransition === 'function' ? transition : converterOrTransition;

    bindWithTransition(this, 'style:' + styleName, observable, converter, transition, (selection: (D3Selection | D3Transition), value: Primitive) => {
        selection.style(styleName, value);
    });
    return this;
}
selection.bindStyle = bindStyle;

function bindAttr(attr: string, observable: Observable<Primitive>, transition?: BindingTransition): D3BindSelection;
function bindAttr<T>(attr: string, observable: Observable<T>, converter: (input: T) => Primitive, transition?: BindingTransition): D3BindSelection;
function bindAttr(attr: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive, transition?: BindingTransition): D3BindSelection;
function bindAttr(attr: string, observable: any, converterOrTransition?: any, transition?: BindingTransition): D3BindSelection {
    var converter = typeof converterOrTransition === 'function' ? converterOrTransition : null;
    var transition: BindingTransition = typeof converterOrTransition === 'function' ? transition : converterOrTransition;

    bindWithTransition(this, 'attr:' + attr, observable, converter, transition, (selection: D3Selection | D3Transition, value: Primitive) => {
        selection.attr(attr, value);
    });
    return this;
}
selection.bindAttr = bindAttr;

function bindProperty(property: string, observable: Observable<Primitive>): D3BindSelection;
function bindProperty<T>(property: string, observable: Observable<T>, converter?: (input: T) => Primitive): D3BindSelection;
function bindProperty(property: string, observable: Observable<any>[], converter: (...params: any[]) => Primitive): D3BindSelection;
function bindProperty(property: string, observable: any, converter?: any): D3BindSelection {
    bind(this, 'property:' + property, observable, converter, (value: Primitive) => {
        this.property(property, value);
    });
    return this;
}
selection.bindProperty = bindProperty;
