import ObservableArray from './array';
import Observable from './observable';
import AbstractObservable from './abstract';


export default class ObservableArrayAll<T> extends AbstractObservable<T> {

    constructor(private array: ObservableArray<T>) {
        super();

        array.subscribe({
            insert: (item, i) => {
                this._trigger(item, null);
            },
            remove: (item, i) => {
                this._trigger(null, item);
            },
            replace: (item, i, oldItem, caller) => {
                this._trigger(item, oldItem, caller);
            }
        });
    }

    get(): T {
        return null; // Not supported
    }
}
