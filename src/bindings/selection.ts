import Observable from "../observable/observable";
import {D3BindSelection} from "../selection";
import {setUnbindForSelectionField} from './unbind';
import {subscribe, getSubscribedValue} from '../observable/helpers';
import Logger from '../utils/logger';


export type BindingApplyFunc<T> = (input: T, caller?: any) => void;

export function bind<V, T>(selection: D3BindSelection, name: string, observable : Observable<T>, converter: (input: T) => V, applyFunc: BindingApplyFunc<V>): void;
export function bind<V>(selection: D3BindSelection, name: string, observable: Observable<any>[], converter: (...params: any[]) => V, applyFunc: BindingApplyFunc<V>): void;
export function bind<V>(selection: D3BindSelection, name: string, observable: any, converter: any, applyFunc: BindingApplyFunc<V>): void {
    var logger = Logger.get('Selection', name);

    applyFunc(getSubscribedValue<V>(observable, converter));

    var unsubscribeFunc = subscribe<V>(observable, converter, (newValue, oldValue, caller) => {
        logger.log(newValue, 'oldValue:', oldValue, 'caller:', caller);
        applyFunc(newValue, caller);
    });

    setUnbindForSelectionField(selection, name, unsubscribeFunc);
}


export interface BindingTransition {
    transition: (t: d3.Transition<any>) => d3.Transition<any> | boolean
}

export type BindingWithTransitionApplyFunc<T> = (selection: d3.Selection<any> | d3.Transition<any>, value: T, caller?: any) => void;

const TRANSITION_PREFIX = 'd3bind_';

function getTransitionSelection(selection: D3BindSelection, transition: BindingTransition, transitionName: string) {
    var _selection: d3.Selection<any> | d3.Transition<any> = null;
    if (transition && transition.transition) {
        _selection = typeof transition.transition === 'function' ?
            <any>transition.transition(selection.transition(transitionName)) : selection.transition(transitionName);
    } else {
        _selection = selection;
    }
    return _selection;
}

export function bindWithTransition<V, T>(selection: D3BindSelection, name: string, observable : Observable<T>, converter: (input: T) => V, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void;
export function bindWithTransition<V>(selection: D3BindSelection, name: string, observable: Observable<any>[], converter: (...params: any[]) => V, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void;
export function bindWithTransition<V>(selection: D3BindSelection, name: string, observable: any, converter: any, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void {
    var logger = Logger.get('Selection', name);
    var transitionName = TRANSITION_PREFIX + name;

    applyFunc(selection, getSubscribedValue<V>(observable, converter));

    var unsubscribeFunc = subscribe<V>(observable, converter, (newValue, oldValue, caller) => {
        var _selection = getTransitionSelection(selection, transition, transitionName);

        logger.log(newValue, 'oldValue:', oldValue, 'caller:', caller);
        applyFunc(_selection, newValue, caller);
    });

    setUnbindForSelectionField(selection, name, unsubscribeFunc);
}
