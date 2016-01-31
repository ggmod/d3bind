import ObservableListLength from './list-length';


export interface ObservableListHandler<T> {
    insert: (item: T, index: number) => void,
    remove: (item: T, index: number) => void,
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

    unsubscribe(handler: ObservableListHandler<T>) {
        var index = this._subscribers.indexOf(handler);
        if (index >= 0) {
            this._subscribers.splice(index, 1);
        }
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

    // length subscribing:

    get $length() {
        return this._observableLength;
    }

    // additional Array methods:

    get(index: number) {
        return this._array[index];
    }

    set(index: number, value: T, noTrigger = false) {
        var oldValue = this._array[index];
        this._array[index] = value;
        if (!noTrigger) {
            this._triggerRemove(oldValue, index);
            this._triggerInsert(value, index);
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
        }
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

    // TODO ES6 iterators
}
