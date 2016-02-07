import Observable from "../observable/observable";
import {ObservableHandler} from "../observable/observable";
import {Noop} from '../utils';


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

export function bind<V, T>(observable : Observable<T>, converter: (input: T) => V, applyFunc: (input: V, caller?: any) => void): Noop;
export function bind<V>(observable: Observable<any>[], converter: (...params: any[]) => V, applyFunc: (input: V, caller?: any) => void): Noop;
export function bind<V>(observable: any, converter: any, applyFunc: (input: V, caller?: any) => void): Noop {
    applyFunc(getBoundValue<V>(observable, converter));

    return subscribe(observable, (newValue, oldValue, caller) => {
        applyFunc(getBoundValue<V>(observable, converter), caller);
    });
}
