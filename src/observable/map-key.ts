import ObservableMap from './map';
import AbstractObservable from './abstract';
import WritableObservable from "./observable";

// FIXME: I had to use loose equality because often one of the keys is a string and the other a number, this problem wouldn't exist with ES6 Maps

export default class ObservableMapKey<K, V> extends AbstractObservable<V> implements WritableObservable<V> {

    constructor(private _map: ObservableMap<K, V>, private _key: K) {
        super(_key.toString());

        _map.subscribe({
            insert: (value, key) => {
                if (key == this._key) {
                    this._trigger(value, undefined);
                }
            },
            remove: (value, key) => {
                if (key == this._key) {
                    this._trigger(undefined, value);
                }
            },
            replace: (value, key, oldValue, caller) => {
                if (key == this._key) {
                    this._trigger(value, oldValue, caller);
                }
            }
        });
    }

    get(): V {
        return this._map.get(this._key);
    }

    set(value: V, noTrigger?: boolean, caller?: any) {
        this._map.set(this._key, value, noTrigger, caller);
    }
}
