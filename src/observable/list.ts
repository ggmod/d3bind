import ObservableListLength from './list-length';
import ObservableListIndex from "./list-index";


export interface ObservableListHandler<T> {
    insert: (item: T, index: number) => void,
    remove: (item: T, index: number) => void,
    replace?: (item: T, index: number, oldValue: T, caller?: any) => void
}

export default class ObservableList<T> {

    private _array: T[] = [];
    private _subscribers: ObservableListHandler<T>[] = [];
    private _observableLength: ObservableListLength;

    get array() {
        return this._array;
    }

    get length() {
        return this._array.length;
    }

    static of<T>(array: Array<T>): ObservableList<T> {
        var list = new ObservableList<T>();
        list._array = array;
        return list;
    }

    constructor() {
        this._observableLength = new ObservableListLength(this);
    }

    // subscribing:

    subscribe(handler: ObservableListHandler<T>): () => void {
        this._subscribers.push(handler);
        return function() { this.unsubscribe(handler); };
    }

    unsubscribe(handler: ObservableListHandler<T>): boolean {
        var index = this._subscribers.indexOf(handler);
        if (index >= 0) {
            this._subscribers.splice(index, 1);
            return true;
        }
        return false;
    }

    unsubscribeAll() {
        this._subscribers = [];
    }

    private _triggerInsert(item: T, index: number) {
        this._subscribers.forEach(subscriber => {
            subscriber.insert.call(null, item, index);
        });
    }

    private _triggerRemove(item: T, index: number) {
        this._subscribers.forEach(subscriber => {
            subscriber.remove.call(null, item, index);
        });
    }

    private _triggerReplace(item: T, index: number, oldValue: T, caller?: any) {
        this._subscribers.forEach(subscriber => {
            if (subscriber.replace != null) {
                subscriber.replace.call(null, item, index, oldValue, caller);
            } else {
                subscriber.remove.call(null, oldValue, index);
                subscriber.insert.call(null, item, index);
            }
        });
    }

    // bindings:

    get $length() {
        return this._observableLength;
    }

    $index(index: number) {
        return new ObservableListIndex<T>(this, index);
    }

    // basic List methods:

    get(index: number) {
        return this._array[index];
    }

    set(index: number, value: T, noTrigger = false, caller?: any) {
        var oldValue = this._array[index];
        this._array[index] = value;
        if (!noTrigger) {
            this._triggerReplace(value, index, oldValue, caller);
        }
    }

    insert(index: number, item: T) {
        this._array.splice(index, 0, item);
        this._triggerInsert(item, index);
    }

    remove(item: T) {
        var index = this._array.indexOf(item);
        if (index >= 0) {
            this._array.splice(index, 1);
            this._triggerRemove(item, index);
            return true;
        }
        return false;
    }

    // TODO readonly Array methods redirected:

    forEach(callback: (value: T, index: number, array: ObservableList<T>) => void): void {
        this._array.forEach((value, index) => {
            callback.call(null, value, index, this);
        });
    }

    map<U>(callback: (value: T, index: number, array: ObservableList<T>) => U): ObservableList<U> {
        return ObservableList.of(this._array.map((item, index) => callback(item, index, this)));
    }

    filter(callback: (value: T, index: number, array: ObservableList<T>) => boolean): ObservableList<T> {
        return ObservableList.of(this._array.filter((item, index) => callback(item, index, this)));
    }

    // TODO writing Array methods rewritten:

    push(...items: T[]): number {
        this._array.push(...items);
        for (var i = 0; i < items.length; i++) {
            this._triggerInsert(items[i], this.length + i);
        }
        return this.length + items.length;
    }

    pop(): T {
        if (this.length === 0) return;
        var removedItem = this._array.pop();
        this._triggerRemove(removedItem, this.length - 1);
        return removedItem;
    }

    splice(start: number, removeCount: number) {
        // TODO copy the entire 500 lines long splice polifyll here...

        if (start > this.length) {
            start = this.length;
        } else if (start < 0) {
            if (-start > this.length) {
                start = 0;
            } else {
                start = this.length - start;
            }
        }
        removeCount = removeCount !== undefined ? Math.min(removeCount, this.length - start): this.length - start;

        var removedItems: T[] = [];
        for (var i = 0; i < removeCount; i++) {
            var removedItem = this._array.splice(start + i, 1)[0];
            removedItems.push(removedItem);
            this._triggerRemove(removedItem, start + i);
        }

        return removedItems;
    }

    // TODO ES6 iterators

    // static constructors:

    static bindTo<T,U>(source: ObservableList<T>, mapper: (item: T) => U): ObservableList<U>;
    static bindTo<T>(source: ObservableList<T>): ObservableList<T>;
    static bindTo<T>(source: ObservableList<T>, mapper?: any) {
        var result = new ObservableList<any>();

        source.forEach(item => {
            result.push(item);
        });

        source.subscribe({
            insert: (item, index) => { result.insert(index, item); },
            remove: (item, index) => { result.splice(index, 1); },
            replace: (item, index, oldValue, caller) => { result.set(index, item, false, caller); }
        });
        return result;
    }
}
