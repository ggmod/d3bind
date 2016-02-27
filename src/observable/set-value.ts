import ObservableSet from './set';
import AbstractObservable from './abstract';

// WARNING: I had to use loose equality because often one of the keys is a string and the other a number, this problem wouldn't exist with ES6 Maps

export default class ObservableSetValue<T> extends AbstractObservable<boolean> {

    constructor(private _set: ObservableSet<T>, private _value: T) {
        super(_value.toString());

        _set.subscribe({
            insert: (value) => {
                if (value == this._value) {
                    this._trigger(true, false);
                }
            },
            remove: (value) => {
                if (value == this._value) {
                    this._trigger(false, true);
                }
            }
        });
    }

    get(): boolean {
        return this._set.has(this._value);
    }
}
