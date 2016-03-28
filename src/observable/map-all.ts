import ObservableMap from './map';
import Observable from './observable';
import AbstractObservable from './abstract';


export default class ObservableMapAll<K, V> extends AbstractObservable<V> {

    constructor(private map: ObservableMap<K,V>) {
        super();

        map.subscribe({
            insert: (item, key) => {
                this._trigger(item, null);
            },
            remove: (item, key) => {
                this._trigger(null, item);
            },
            replace: (item, key, oldItem, caller) => {
                this._trigger(item, oldItem, caller);
            }
        });
    }

    get(): V {
        return null; // Not supported
    }
}
