import {ObservableHandler, WritableObservable} from "./observable";
import AbstractObservable from "./abstract";


export default class ObservableValue<T> extends AbstractObservable<T> implements WritableObservable<T> {

    private _value: T;

    constructor(initialValue: T) {
        super();

        this._value = initialValue;
    }

    get(): T {
        return this._value;
    }

    set(value: T, noTrigger = false, caller?: any) {
        var oldValue = this._value;
        this._value = value;
        if (!noTrigger) {
            this._trigger(value, oldValue, caller);
        }
    }
}
