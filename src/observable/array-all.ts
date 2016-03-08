import OBservableArray from './array';
import Observable from './observable';
import AbstractObservable from './abstract';


export default class ObservableArrayAll<T, V> extends AbstractObservable<V> {

    private _unbinds: (() => void)[] = [];

    constructor(private array: OBservableArray<T>, private accessor: (item: T) => Observable<V>) {
        super();

        array.forEach((item, i) => {
            this._subscribeItem(item, i);
        });

        array.subscribe({
            insert: (item, i) => {
                this._subscribeItem(item, i);

                var value = this.accessor(item).get();
                this._trigger(value, null);
            },
            remove: (item, i) => {
                this._unsubscribeItem(item, i);

                var value = this.accessor(item).get();
                this._trigger(null, value);
            }
        });
    }

    _subscribeItem(item: T, index: number) {
        var observable = this.accessor(item);
        var unbind = observable.subscribe((value, oldValue, caller) => {
            this._trigger(value, oldValue, caller);
        });
        this._unbinds.splice(index, 0, unbind);
    }

    _unsubscribeItem(item: T, index: number) {
        this._unbinds[index]();
        this._unbinds.splice(index, 1);
    }

    get(): V {
        return null; // Not supported
    }
}
