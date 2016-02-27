import {ObservableHandler, WritableObservable} from "./observable";
import AbstractObservable from "./abstract";


export default class ObservableProxy<T> extends AbstractObservable<T> implements WritableObservable<T> {

    constructor(private _getter: () => T, private _setter: (value: T) => void, name?: string) {
        super(name);
    }

    get(): T {
        return this._getter();
    }

    set(value: T, noTrigger = false, caller?: any) {
        var oldValue = this._getter();
        this._setter(value);
        if (!noTrigger) {
            this._trigger(value, oldValue, caller);
        }
    }
}
