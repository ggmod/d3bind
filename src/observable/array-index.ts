import ObservableArray from './array';
import AbstractObservable from './abstract';
import WritableObservable from "./observable";


export default class ObservableArrayIndex<T> extends AbstractObservable<T> implements WritableObservable<T> {

    constructor(private _list: ObservableArray<T>, private _index: number) {
        super();

        _list.subscribe({
            insert: (value, index) => {
                if (index <= this._index && this._list.length > this._index) {
                    var oldValue = this._index + 1 < this._list.length ? this._list.get(this._index + 1) : undefined;
                    var newValue = this._list.length > this._index ? this.get() : undefined;
                    this._trigger(newValue, oldValue);
                }
            },
            remove: (value, index) => {
                if (index <= this._index && this._list.length >= this._index) {
                    var oldValue = this._index - 1 >= 0 ? this._list.get(this._index - 1) : undefined;
                    var newValue = this._list.length > this._index ? this.get() : undefined;
                    this._trigger(newValue, oldValue);
                }
            },
            replace: (value, index, oldValue, caller) => {
                if (index === this._index) {
                    this._trigger(value, oldValue, caller);
                }
            }
        });
    }

    get(): T {
        return this._list.get(this._index);
    }

    set(value: T, noTrigger?: boolean, caller?: any) {
        this._list.set(this._index, value, noTrigger, caller);
    }
}
