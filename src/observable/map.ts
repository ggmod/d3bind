import ObservableMapSize from './map-size';
import ObservableMapKey from './map-key';
import ObservableArray from './array';
import Logger from '../utils/logger';
import Subscribable from "./subscribable";


export interface ObservableMapHandler<K, V> {
    insert: (value: V, key: K) => void,
    remove: (value: V, key: K) => void,
    replace?: (value: V, key: K, oldValue: V, caller?: any) => void
}

export default class ObservableMap<K, V> extends Subscribable<ObservableMapHandler<K, V>> {

    private _map: any = Object.create(null);
    private _size = 0;

    private _observableSize: ObservableMapSize;

    private _logger = Logger.get((<any>this.constructor).name);

    get map() {
        return this._map;
    }

    get size() {
        return this._size;
    }

    constructor() {
        super();
        this._observableSize = new ObservableMapSize(this);
    }

    // subscribing:

    private _triggerInsert(item: V, key: K) {
        this._size++;

        this._logger.logIndent('insert', item, 'key:', key);

        this._subscribers.forEach(subscriber => {
            subscriber.insert.call(null, item, key);
        });

        this._logger.logUnindent();
    }

    private _triggerRemove(item: V, key: K) {
        this._size--;

        this._logger.logIndent('remove', item, 'key:', key);

        this._subscribers.forEach(subscriber => {
            subscriber.remove.call(null, item, key);
        });

        this._logger.logUnindent();
    }

    private _triggerReplace(item: V, key: K, oldValue: V, caller?: any) {
        this._logger.logIndent('replace', item, 'key:', key, 'oldValue:', oldValue, 'caller:', caller);

        this._subscribers.forEach(subscriber => {
            if (subscriber.replace != null) {
                subscriber.replace.call(null, item, key, oldValue, caller);
            } else {
                subscriber.remove.call(null, oldValue, key);
                subscriber.insert.call(null, item, key);
            }
        });

        this._logger.logUnindent();
    }

    // bindings:

    get $size() {
        return this._observableSize;
    }

    $key(key: K) {
        return new ObservableMapKey<K,V>(this, key);
    }

    // basic Map methods:

    get(key: K): V {
        return this._map[<any>key];
    }

    has(key: K): boolean {
        return this._map[<any>key] !== undefined;
    }

    set(key: K, value: V, noTrigger = false, caller?: any) {
        var oldValue = this._map[<any>key];
        this._map[<any>key] = value;
        if (!noTrigger) {
            if (oldValue !== undefined) {
                this._triggerReplace(value, key, oldValue, caller);
            } else {
                this._triggerInsert(value, key);
            }
        }
        return this;
    }

    delete(key: K): boolean {
        var value = this._map[<any>key];
        if (value !== undefined) {
            delete this._map[<any>key];
            this._triggerRemove(value, key);
            return true;
        }
        return false;
    }

    clear() {
        for (var key in this._map) {
            var value = this._map[key];
            delete this._map[key];
            this._triggerRemove(value, key);
        }
    }

    forEach(callback: (value: V, index: K, map: ObservableMap<K, V>) => void): void {
        for (var key in this._map) {
            callback.call(null, this._map[key], key, this);
        }
    }

    // static constructors:

    static bindTo<T,K,V>(source: ObservableArray<T>, keyMapper: (item: T) => K, valueMapper: (item: T) => V): ObservableMap<K,V>;
    static bindTo<T,K>(source: ObservableArray<T>, keyMapper: (item: T) => K): ObservableMap<K,T>;
    static bindTo<T,K>(source: ObservableArray<T>, keyMapper: (item: T) => K, valueMapper?: any): ObservableMap<K,any> {
        var result = new ObservableMap<K,any>();

        source.forEach((item) => {
            var key = keyMapper(item);
            var value = valueMapper !== undefined ? valueMapper(item) : item;
            result.set(key, value);
        });

        source.subscribe({
            insert: (item) => {
                var key = keyMapper(item);
                var value = valueMapper !== undefined ? valueMapper(item) : item;
                result.set(key, value);
            },
            remove: (item) => {
                result.delete(keyMapper(item));
            }
        });
        return result;
    }
}
