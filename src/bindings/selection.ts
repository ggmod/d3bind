import Observable from "../observable/observable";
import {D3BindSelection, D3Selection, D3Transition} from "../selection";
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
        logger.log(newValue, '| oldValue:', oldValue, '| caller:', caller, '| node:', selection.node());
        applyFunc(newValue, caller);
    });

    setUnbindForSelectionField(selection, name, unsubscribeFunc);
}


export interface BindingTransition {
    transition: boolean | ((t: D3Transition) => D3Transition)
}

export type BindingWithTransitionApplyFunc<T> = (selection: D3Selection | D3Transition, value: T, caller?: any) => void;

const TRANSITION_PREFIX = 'd3bind_';

export function getTransitionSelection(selection: D3BindSelection, transition: BindingTransition, name: string): D3Selection | D3Transition {
    var transitionName = TRANSITION_PREFIX + name;

    var _selection: D3Selection | D3Transition = null;
    if (transition && transition.transition) {
        var _transition: D3Transition = selection.transition(transitionName);
        if (typeof transition.transition === 'function') {
            var transitionConverter = (<(t: D3Transition) => D3Transition>transition.transition);
            _selection = transitionConverter(_transition);
        } else {
            _selection = _transition;
        }
    } else {
        _selection = selection;
    }
    return _selection;
}

export function bindWithTransition<V, T>(selection: D3BindSelection, name: string, observable : Observable<T>, converter: (input: T) => V, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void;
export function bindWithTransition<V>(selection: D3BindSelection, name: string, observable: Observable<any>[], converter: (...params: any[]) => V, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void;
export function bindWithTransition<V>(selection: D3BindSelection, name: string, observable: any, converter: any, transition: BindingTransition, applyFunc: BindingWithTransitionApplyFunc<V>): void {
    var logger = Logger.get('Selection', name);

    applyFunc(selection, getSubscribedValue<V>(observable, converter));

    var unsubscribeFunc = subscribe<V>(observable, converter, (newValue, oldValue, caller) => {
        var _selection = getTransitionSelection(selection, transition, name);

        logger.log(newValue, '| oldValue:', oldValue, '| caller:', caller, '| node:', selection.node());
        applyFunc(_selection, newValue, caller);
    });

    setUnbindForSelectionField(selection, name, unsubscribeFunc);
}
