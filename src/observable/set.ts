import ObservableSetSize from './set-size';
import ObservableSetValue from './set-value';
import ObservableArray from './array';
import Logger from '../utils/logger';
import Subscribable from "./subscribable";
import Observable from './observable';
import ObservableSetAll from './set-all';
import ObservableSetAllAccessor from './set-all-accessor';


export interface ObservableSetHandler<T> {
    insert: (value: T) => void,
    remove: (value: T) => void
}

export default class ObservableSet<T> extends Subscribable<ObservableSetHandler<T>> {

    private _map: any = Object.create(null);
    private _size = 0;

    private _observableSize: ObservableSetSize;

    private _logger = Logger.get((<any>this.constructor).name);

    get size() {
        return this._size;
    }

    constructor() {
        super();
        this._observableSize = new ObservableSetSize(this);
    }

    // subscribing:

    private _triggerInsert(item: T) {
        this._size++;

        this._logger.logIndent('insert:', item);

        this._subscribers.forEach(subscriber => {
            subscriber.insert.call(null, item);
        });

        this._logger.logUnindent();
    }

    private _triggerRemove(item: T) {
        this._size--;

        this._logger.logIndent('remove:', item);

        this._subscribers.forEach(subscriber => {
            subscriber.remove.call(null, item);
        });

        this._logger.logUnindent();
    }

    // bindings:

    get $size(): Observable<number> {
        return this._observableSize;
    }

    $has(value: T): Observable<boolean> {
        return new ObservableSetValue<T>(this, value);
    }

    $all(): Observable<T>;
    $all<V>(accessor: (item: T) => Observable<V>): Observable<V>;
    $all<V>(accessor?: (item: T) => Observable<V>): any {
        if (accessor) {
            return new ObservableSetAllAccessor<T, V>(this, accessor);
        } else {
            return new ObservableSetAll<T>(this);
        }
    }

    // basic Set methods:

    has(value: T): boolean {
        return this._map[<any>value] !== undefined;
    }

    add(value: T) {
        var exists = this._map[<any>value];
        this._map[<any>value] = true;
        if (exists === undefined) {
            this._triggerInsert(value);
        }
        return this;
    }

    delete(value: T): boolean {
        var exists = this._map[<any>value];
        if (exists !== undefined) {
            delete this._map[<any>value];
            this._triggerRemove(value);
            return true;
        }
        return false;
    }

    clear() {
        for (var key in this._map) {
            delete this._map[key];
            this._triggerRemove(<any>key);
        }
    }

    forEach(callback: (value: T, value2: T, map: ObservableSet<T>) => void): void {
        for (var key in this._map) {
            callback.call(null, key, key, this);
        }
    }

    // static constructors:

    static bindTo<T>(source: ObservableArray<T>): ObservableSet<T>;
    static bindTo<T,V>(source: ObservableArray<T>, mapper: (item: T) => V): ObservableSet<V>;
    static bindTo<T>(source: ObservableArray<T>, mapper?: any): ObservableSet<any> {
        var result = new ObservableSet<any>();
        var counts = Object.create(null);

        source.forEach((item) => {
            var value = mapper !== undefined ? mapper(item) : item;
            counts[value] = counts[value] ? ++counts[value] : 1;
            result.add(value);
        });

        source.subscribe({
            insert: (item) => {
                var value = mapper !== undefined ? mapper(item) : item;
                counts[value] = counts[value] ? ++counts[value] : 1;
                if (counts[value] === 1) {
                    result.add(value);
                }
            },
            remove: (item) => {
                var value = mapper !== undefined ? mapper(item) : item;
                counts[value] = counts[value] ? --counts[value] : 0;
                if (counts[value] === 0) {
                    result.delete(value);
                }
            }
        });
        return result;
    }
}
