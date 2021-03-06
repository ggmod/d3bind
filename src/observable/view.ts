import AbstractObservable from "./abstract";
import Observable from './observable';
import {subscribe, getSubscribedValue} from './helpers';


export default class ObservableView<T> extends AbstractObservable<T> {

    /*private*/ constructor(private observable: any, private converter: any) {
        super();

        subscribe<T>(observable, converter, (newValue, oldValue, caller) => {
            this._trigger(newValue, oldValue, caller);
        });
    }

    get(): T {
        return getSubscribedValue<T>(this.observable, this.converter);
    }

    static bindTo<T, U>(observable: Observable<U>, converter: (input: U) => T): Observable<T>;
    static bindTo<T>(observable: Observable<any>[], converter: (...params: any[]) => T): Observable<T>;
    static bindTo<T>(observable: any, converter: any): Observable<T> {
        return new ObservableView<T>(observable, converter);
    }
}
