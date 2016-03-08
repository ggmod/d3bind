import Observable from "./observable";
import {ObservableHandler} from "./observable";


export function getSubscribedValue<V, T>(observable : Observable<T>, converter?: (input: T) => V): V;
export function getSubscribedValue<V>(observable: Observable<any>[], converter: (...params: any[]) => V): V;
export function getSubscribedValue<V>(observable: any, converter: any): V {
    if (converter != null && observable instanceof Array) {
        var inputs = observable.map((property: Observable<any>) => property.get());
        return converter.apply(null, inputs);
    } else if (converter != null) {
        return converter.call(null, observable.get());
    } else {
        return observable.get();
    }
}


type Unsubscribe = () => boolean;

function unsubscribeEvery(func: Unsubscribe | Unsubscribe[]): number {
    if (func instanceof Array) {
        return func.map((funcItem: Unsubscribe) => funcItem()).filter(unsubscribed => unsubscribed).length;
    } else if (func instanceof Function) {
        return func() ? 1 : 0;
    }
}

export function subscribeEvery(observable: Observable<any> | Observable<any>[], handler: ObservableHandler<any>): () => number {
    var unbind: Unsubscribe | Unsubscribe[] = null;

    if (observable instanceof Array) {
        unbind = observable.map((obsItem: Observable<any>) => obsItem.subscribe(handler));
    } else {
        unbind = (<Observable<any>>observable).subscribe(handler);
    }

    return () => unsubscribeEvery(unbind);
}

export function subscribe<V, T>(observable : Observable<T>, converter: (input: T) => V, handler: ObservableHandler<V>): () => number;
export function subscribe<V>(observable: Observable<any>[], converter: (...params: any[]) => V, handler: ObservableHandler<V>): () => number;
export function subscribe<V>(observable: any, converter: any, handler: ObservableHandler<V>): () => number {

    var previousValue: V = getSubscribedValue<V>(observable, converter);

    return subscribeEvery(observable, (newValue, oldValue, caller) => {
        var newConvertedValue = getSubscribedValue<V>(observable, converter);
        handler.call(null, newConvertedValue, previousValue, caller);
        previousValue = newConvertedValue;
    });
}
