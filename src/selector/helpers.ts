import Observable from "../observable/observable";

type Noop = () => void;

function getBoundValue<V, T>(observable : Observable<T>, converter?: (input: T) => V): V;
function getBoundValue<V>(observable: Observable<any>[], converter: (...params: any[]) => V): V;
function getBoundValue<V>(observable: any, converter: any): V {
    if (converter !== undefined && observable instanceof Array) {
        var inputs = observable.map((property: Observable<any>) => property.get());
        return converter.apply(null, inputs);
    } else if (converter !== undefined) {
        return converter.call(null, observable.get());
    } else {
        return observable.get();
    }
}

function callEvery(func: Noop | Noop[]) {
    if (func instanceof Array) {
        func.forEach((funcItem: ()=> void) => { funcItem(); });
    } else if (func instanceof  Function) {
        func();
    }
}

function subscribe<T>(observable : Observable<T>, handler: Noop): Noop;
function subscribe(observable: Observable<any>[], handler: Noop): Noop;
function subscribe(observable: any, handler: Noop): Noop {
    var unbind: Noop | Noop[] = null;
    if (observable instanceof Array) {
        unbind = observable.map((property: Observable<any>) => { property.subscribe(handler); });
    } else {
        unbind = observable.subscribe(handler);
    }

    return () => { callEvery(unbind) };
}

export function bind<V, T>(observable : Observable<T>, converter: (input: T) => V, applyFunc: (input: V) => void): void;
export function bind<V>(observable: Observable<any>[], converter: (...params: any[]) => V, applyFunc: (input: V) => void): void;
export function bind<V>(observable: any, converter: any, applyFunc: (input: V) => void): void {
    applyFunc(getBoundValue<V>(observable, converter));

    subscribe(observable, () => {
        applyFunc(getBoundValue<V>(observable, converter));
    });
}
