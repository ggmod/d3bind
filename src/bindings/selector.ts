import Observable from "../observable/observable";
import {D3BindSelector} from "../selector";
import {setUnbindForSelectorField} from './unbind';
import {subscribe, getBoundValue} from './helpers';


type BindingApplyFunc<T> = (input: T, caller?: any) => void;

export function bind<V, T>(selector: D3BindSelector, name: string, observable : Observable<T>, converter: (input: T) => V, applyFunc: BindingApplyFunc<V>): void;
export function bind<V>(selector: D3BindSelector, name: string, observable: Observable<any>[], converter: (...params: any[]) => V, applyFunc: BindingApplyFunc<V>): void;
export function bind<V>(selector: D3BindSelector, name: string, observable: any, converter: any, applyFunc: BindingApplyFunc<V>): void {
    applyFunc(getBoundValue<V>(observable, converter));

    var unsubscribeFunc = subscribe(observable, (newValue, oldValue, caller) => {
        applyFunc(getBoundValue<V>(observable, converter), caller);
    });

    setUnbindForSelectorField(selector, name, unsubscribeFunc);
}


export interface BindingTransition {
    transition: (t: d3.Transition<any>) => d3.Transition<any> | boolean
}

type BindingWithTransitionApplyFunc<T> = (selector: d3.Selection<any> | d3.Transition<any>, value: T, caller?: any) => void;

const TRANSITION_PREFIX = 'd3bind_';

export function bindWithTransition<V, T>(selector: D3BindSelector, name: string, observable : Observable<T>, converter: (input: T) => V, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void;
export function bindWithTransition<V>(selector: D3BindSelector, name: string, observable: Observable<any>[], converter: (...params: any[]) => V, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void;
export function bindWithTransition<V>(selector: D3BindSelector, name: string, observable: any, converter: any, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void {
    var transitionName = TRANSITION_PREFIX + name;

    applyFunc(selector, getBoundValue<V>(observable, converter));

    var unsubscribeFunc = subscribe(observable, (newValue, oldValue, caller) => {
        var _selector: d3.Selection<any> | d3.Transition<any> = null;
        if (transition && transition.transition) {
            _selector = typeof transition.transition === 'function' ?
                <any>transition.transition(selector.transition(transitionName)) : selector.transition(transitionName);
        } else {
            _selector = selector;
        }
        applyFunc(_selector, getBoundValue<V>(observable, converter), caller);
    });

    setUnbindForSelectorField(selector, name, unsubscribeFunc);
}
