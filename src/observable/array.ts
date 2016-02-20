import ObservableArrayLength from './array-length';
import ObservableArrayIndex from "./array-index";


export interface ObservableArrayHandler<T> {
    insert: (item: T, index: number) => void,
    remove: (item: T, index: number) => void,
    replace?: (item: T, index: number, oldValue: T, caller?: any) => void
}

export default class ObservableArray<T> {

    private _array: T[] = [];
    private _subscribers: ObservableArrayHandler<T>[] = [];
    private _observableLength: ObservableArrayLength;

    get array() {
        return this._array;
    }

    get length() {
        return this._array.length;
    }

    static of<T>(array: Array<T>): ObservableArray<T> {
        var obsArray = new ObservableArray<T>();
        obsArray._array = array;
        return obsArray;
    }

    constructor() {
        this._observableLength = new ObservableArrayLength(this);
    }

    // subscribing:

    subscribe(handler: ObservableArrayHandler<T>): () => boolean {
        this._subscribers.push(handler);
        return () => this.unsubscribe(handler);
    }

    unsubscribe(handler: ObservableArrayHandler<T>): boolean {
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
        return new ObservableArrayIndex<T>(this, index);
    }

    // basic Array methods:

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

    // readonly Array methods redirected:

    forEach(callback: (value: T, index: number, array: ObservableArray<T>) => void): void {
        this._array.forEach((value, index) => {
            callback.call(null, value, index, this);
        });
    }

    map<U>(callback: (value: T, index: number, array: ObservableArray<T>) => U): ObservableArray<U> {
        return ObservableArray.of(this._array.map((item, index) => callback(item, index, this)));
    }

    filter(callback: (value: T, index: number, array: ObservableArray<T>) => boolean): ObservableArray<T> {
        return ObservableArray.of(this._array.filter((item, index) => callback(item, index, this)));
    }

    reduce(callback: (previousValue: T, currentValue: T, currentIndex: number, array: ObservableArray<T>) => T, initialValue?: T): T;
    reduce<U>(callback: (previousValue: U, currentValue: T, currentIndex: number, array: ObservableArray<T>) => U, initialValue: U): U;
    reduce(callback: (previousValue: any, currentValue: T, currentIndex: number, array: ObservableArray<T>) => any, initialValue: any): any {
        return this._array.reduce((previousValue, currentValue, currentIndex) => callback(previousValue, currentValue, currentIndex, this), initialValue);
    }

    reduceRight(callback: (previousValue: T, currentValue: T, currentIndex: number, array: ObservableArray<T>) => T, initialValue?: T): T;
    reduceRight<U>(callback: (previousValue: U, currentValue: T, currentIndex: number, array: ObservableArray<T>) => U, initialValue: U): U;
    reduceRight(callback: (previousValue: any, currentValue: T, currentIndex: number, array: ObservableArray<T>) => any, initialValue: any): any {
        return this._array.reduceRight((previousValue, currentValue, currentIndex) => callback(previousValue, currentValue, currentIndex, this), initialValue);
    }

    concat<U extends T[]>(...items: U[]): ObservableArray<T>;
    concat(...items: T[]): ObservableArray<T>;
    concat(...items: any[]): ObservableArray<T> {
        return ObservableArray.of(this._array.concat(items));
    }

    slice(start?: number, end?: number): ObservableArray<T> {
        return ObservableArray.of(this._array.slice(start, end));
    }

    join(separator?: string): string {
        return this._array.join(separator);
    }

    every(callback: (value: T, index: number, array: T[]) => boolean): boolean {
        return this._array.every(callback);
    }

    some(callback: (value: T, index: number, array: T[]) => boolean): boolean {
        return this._array.some(callback);
    }

    indexOf(searchElement: T, fromIndex?: number): number {
        return this._array.indexOf(searchElement, fromIndex);
    }

    lastIndexOf(searchElement: T, fromIndex?: number): number {
        return this._array.lastIndexOf(searchElement, fromIndex);
    }

    toString(): string {
        return this._array.toString();
    }

    toLocaleString(): string {
        return this._array.toLocaleString();
    }

    // TODO write the missing Array mutator methods (reverse, sort) :

    push(...items: T[]): number {
        for (var i = 0; i < items.length; i++) {
            this._array.push(items[i]);
            this._triggerInsert(items[i], this.length - 1);
        }
        return this.length;
    }

    pop(): T {
        if (this.length === 0) return;
        var removedItem = this._array.pop();
        this._triggerRemove(removedItem, this.length);
        return removedItem;
    }

    shift(): T {
        if (this.length === 0) return;
        var removedItem = this._array.shift();
        this._triggerRemove(removedItem, 0);
        return removedItem;
    }

    unshift(...items: T[]): number {
        for (var i = items.length - 1; i >= 0; i--) {
            this._array.splice(0, 0, items[i]);
            this._triggerInsert(items[i], 0);
        }
        return this.length;
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

    // TODO ES6 iterators and functions

    // static constructors:

    static bindTo<T,U>(source: ObservableArray<T>, mapper: (item: T) => U): ObservableArray<U>;
    static bindTo<T>(source: ObservableArray<T>): ObservableArray<T>;
    static bindTo<T>(source: ObservableArray<T>, mapper?: any) {
        var result = new ObservableArray<any>();

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
