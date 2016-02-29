import Observable from "../observable/observable";
import {D3BindSelector} from "../selector";
import {setUnbindForSelectorField} from './unbind';
import {subscribe, getSubscribedValue} from '../observable/helpers';
import Logger from '../utils/logger';


export type BindingApplyFunc<T> = (input: T, caller?: any) => void;

export function bind<V, T>(selector: D3BindSelector, name: string, observable : Observable<T>, converter: (input: T) => V, applyFunc: BindingApplyFunc<V>): void;
export function bind<V>(selector: D3BindSelector, name: string, observable: Observable<any>[], converter: (...params: any[]) => V, applyFunc: BindingApplyFunc<V>): void;
export function bind<V>(selector: D3BindSelector, name: string, observable: any, converter: any, applyFunc: BindingApplyFunc<V>): void {
    var logger = Logger.get('Selector', name);

    applyFunc(getSubscribedValue<V>(observable, converter));

    var unsubscribeFunc = subscribe<V>(observable, converter, (newValue, oldValue, caller) => {
        logger.log(newValue, 'oldValue:', oldValue, 'caller:', caller);
        applyFunc(newValue, caller);
    });

    setUnbindForSelectorField(selector, name, unsubscribeFunc);
}


export interface BindingTransition {
    transition: (t: d3.Transition<any>) => d3.Transition<any> | boolean
}

export type BindingWithTransitionApplyFunc<T> = (selector: d3.Selection<any> | d3.Transition<any>, value: T, caller?: any) => void;

const TRANSITION_PREFIX = 'd3bind_';

function getTransitionSelector(selector: D3BindSelector, transition: BindingTransition, transitionName: string) {
    var _selector: d3.Selection<any> | d3.Transition<any> = null;
    if (transition && transition.transition) {
        _selector = typeof transition.transition === 'function' ?
            <any>transition.transition(selector.transition(transitionName)) : selector.transition(transitionName);
    } else {
        _selector = selector;
    }
    return _selector;
}

export function bindWithTransition<V, T>(selector: D3BindSelector, name: string, observable : Observable<T>, converter: (input: T) => V, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void;
export function bindWithTransition<V>(selector: D3BindSelector, name: string, observable: Observable<any>[], converter: (...params: any[]) => V, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void;
export function bindWithTransition<V>(selector: D3BindSelector, name: string, observable: any, converter: any, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void {
    var logger = Logger.get('Selector', name);
    var transitionName = TRANSITION_PREFIX + name;

    applyFunc(selector, getSubscribedValue<V>(observable, converter));

    var unsubscribeFunc = subscribe<V>(observable, converter, (newValue, oldValue, caller) => {
        var _selector = getTransitionSelector(selector, transition, transitionName);

        logger.log(newValue, 'oldValue:', oldValue, 'caller:', caller);
        applyFunc(_selector, newValue, caller);
    });

    setUnbindForSelectorField(selector, name, unsubscribeFunc);
}
