import ObservableSet from './set';
import Observable from './observable';
import AbstractObservable from './abstract';


export default class ObservableSetAllAccessor<T, V> extends AbstractObservable<V> {

    private _unbinds: any = Object.create(null);

    constructor(private _set: ObservableSet<T>, private accessor: (item: T) => Observable<V>) {
        super();

        _set.forEach(item => {
            this._subscribeItem(item);
        });

        _set.subscribe({
            insert: item => {
                this._subscribeItem(item);
                var value = this.accessor(item).get();
                this._trigger(value, null);
            },
            remove: item => {
                this._unsubscribeItem(item);
                var value = this.accessor(item).get();
                this._trigger(null, value);
            }
        });
    }

    _subscribeItem(item: T) {
        var observable = this.accessor(item);
        this._unbinds[<any>item] = observable.subscribe((value, oldValue, caller) => {
            this._trigger(value, oldValue, caller);
        });
    }

    _unsubscribeItem(item: T) {
        this._unbinds[<any>item]();
        delete this._unbinds[<any>item];
    }

    get(): V {
        return null; // Not supported
    }
}
