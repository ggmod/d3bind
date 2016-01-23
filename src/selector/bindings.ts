import selector from '../selector';
import {bind} from './helpers';
import Observable from "../observable/observable";
import {D3BindSelector} from "../selector";


function bindText(observable: Observable<any>[], converter: (...params: any[]) => string): D3BindSelector;
function bindText<T>(observable: Observable<T>, converter?: (input: T) => string): D3BindSelector;
function bindText(observable: any, converter: any): D3BindSelector {
    bind(observable, converter, (value: string) => {
        this.text(value);
    });
    return this;
}
selector.bindText = bindText;

function bindClassed(className: string, observable: Observable<any>[], converter: (...params: any[]) => string): D3BindSelector;
function bindClassed<T>(className: string, observable: Observable<T>, converter?: (input: T) => string): D3BindSelector;
function bindClassed(className: string, observable: any, converter: any): D3BindSelector {
    bind(observable, converter, (value: string) => {
        this.classed(className, value);
    });
    return this;
}
selector.bindClassed = bindClassed;
