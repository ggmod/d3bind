import Observable from "../observable/observable";
import {ObservableHandler} from "../observable/observable";
import {Noop} from '../utils';
import {D3BindSelector} from "../selector";


function getBoundValue<V, T>(observable : Observable<T>, converter?: (input: T) => V): V;
function getBoundValue<V>(observable: Observable<any>[], converter: (...params: any[]) => V): V;
function getBoundValue<V>(observable: any, converter: any): V {
    if (converter != null && observable instanceof Array) {
        var inputs = observable.map((property: Observable<any>) => property.get());
        return converter.apply(null, inputs);
    } else if (converter != null) {
        return converter.call(null, observable.get());
    } else {
        return observable.get();
    }
}

function callEvery(func: Noop | Noop[]) {
    if (func instanceof Array) {
        func.forEach((funcItem: ()=> void) => { funcItem(); });
    } else if (func instanceof Function) {
        func();
    }
}

export function subscribe(observable: Observable<any> | Observable<any>[], handler: ObservableHandler<any>): Noop {
    var unbind: Noop | Noop[] = null;

    if (observable instanceof Array) {
        unbind = observable.map((obsItem: Observable<any>) => obsItem.subscribe(handler));
    } else {
        unbind = (<Observable<any>>observable).subscribe(handler);
    }

    return () => { callEvery(unbind) };
}


type BindingApplyFunc<T> = (input: T, caller?: any) => void;

export function bind<V, T>(observable : Observable<T>, converter: (input: T) => V, applyFunc: BindingApplyFunc<V>): void;
export function bind<V>(observable: Observable<any>[], converter: (...params: any[]) => V, applyFunc: BindingApplyFunc<V>): void;
export function bind<V>(observable: any, converter: any, applyFunc: BindingApplyFunc<V>): void {
    applyFunc(getBoundValue<V>(observable, converter));

    subscribe(observable, (newValue, oldValue, caller) => {
        applyFunc(getBoundValue<V>(observable, converter), caller);
    });
}


export interface BindingTransition {
    transition: (t: d3.Transition<any>) => d3.Transition<any> | boolean
}

type BindingWithTransitionApplyFunc<T> = (selector: d3.Selection<any> | d3.Transition<any>, value: T, caller?: any) => void;

export function bindWithTransition<V, T>(selector: D3BindSelector, name: string, observable : Observable<T>, converter: (input: T) => V, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void;
export function bindWithTransition<V>(selector: D3BindSelector, name: string, observable: Observable<any>[], converter: (...params: any[]) => V, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void;
export function bindWithTransition<V>(selector: D3BindSelector, name: string, observable: any, converter: any, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void {
    name = 'd3bind_' + name;

    applyFunc(selector, getBoundValue<V>(observable, converter));

    subscribe(observable, (newValue, oldValue, caller) => {
        var _selector: d3.Selection<any> | d3.Transition<any> = null;
        if (transition && transition.transition) {
            _selector = typeof transition.transition === 'function' ? <any>transition.transition(selector.transition(name)) : selector.transition(name);
        } else {
            _selector = selector;
        }
        applyFunc(_selector, getBoundValue<V>(observable, converter), caller);
    });
}
