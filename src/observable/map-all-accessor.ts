import ObservableMap from './map';
import Observable from './observable';
import AbstractObservable from './abstract';


export default class ObservableArrayAllAccessor<K,V,T> extends AbstractObservable<T> {

    private _unbinds: any = Object.create(null);

    constructor(private map: ObservableMap<K,V>, private accessor: (item: V) => Observable<T>) {
        super();

        map.forEach((item, key) => {
            this._subscribeItem(item, key);
        });

        map.subscribe({
            insert: (item, key) => {
                this._subscribeItem(item, key);
                var value = this.accessor(item).get();
                this._trigger(value, null);
            },
            remove: (item, key) => {
                this._unsubscribeItem(item, key);
                var value = this.accessor(item).get();
                this._trigger(null, value);
            },
            replace: (item, key, oldItem, caller) => {
                this._unsubscribeItem(oldItem, key);
                this._subscribeItem(item, key);
                var value = this.accessor(item).get();
                var oldValue = this.accessor(oldItem).get();
                this._trigger(value, oldValue, caller);
            }
        });
    }

    _subscribeItem(item: V, key: K) {
        var observable = this.accessor(item);
        this._unbinds[<any>key] = observable.subscribe((value, oldValue, caller) => {
            this._trigger(value, oldValue, caller);
        });
    }

    _unsubscribeItem(item: V, key: K) {
        this._unbinds[<any>key]();
        delete this._unbinds[<any>key];
    }

    get(): T {
        return null; // Not supported
    }
}
