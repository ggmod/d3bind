import {ObservableHandler} from "./observable";
import Observable from './observable';


export default class ObservableProperty<T> implements Observable<T> {

    private _name: string;
    private _parent: any;
    private _subscribers: ObservableHandler<T>[] = [];
    private _value: T;

    constructor(parent: any, name: string) {
        this._name = name; // TODO getter only
        this._parent = parent;

        this._value = parent[name];

        Object.defineProperty(parent, name, {
            enumerable: true,
            get: () => this._value,
            set: (value) => { this.set(value); }
        });

        parent['$' + name] = this;
    }

    get(): T {
        return this._value;
    }

    set(value: T, noTrigger = false) {
        var oldValue = this._value;
        this._value = value;
        if (!noTrigger) {
            this._trigger(oldValue, value);
        }
    }

    subscribe(handler: ObservableHandler<T>): () => void {
        this._subscribers.push(handler);
        return function() { this.unsubscribe(handler); };
    }

    unsubscribe(handler: ObservableHandler<T>) {
        var index = this._subscribers.indexOf(handler);
        if (index >= 0) {
            this._subscribers.splice(index, 1);
        }
    }

    unsubscribeAll() {
        this._subscribers = [];
    }

    trigger() {
        var value = this._value;
        this._trigger(value, value);
    }

    _trigger(oldValue: T, newValue: T) {
        this._subscribers.forEach(function(subscriber) {
            subscriber.call(null, newValue, oldValue);
        });
    }
}
