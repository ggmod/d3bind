import {ObservableHandler, WritableObservable} from "./observable";
import AbstractObservable from "./abstract";


export default class ObservableProperty<T> extends AbstractObservable<T> implements WritableObservable<T> {

    private _parent: any;
    private _value: T;

    /* private */ constructor(parent: any, name: string) {
        super(name);

        this._parent = parent;

        this._value = parent[name];

        Object.defineProperty(parent, name, {
            enumerable: true,
            get: () => this._value,
            set: (value) => { this.set(value); }
        });

        parent['$' + name] = this;
    }

    get name() {
        return this._name;
    }

    get parent() {
        return this._parent;
    }

    get(): T {
        return this._value;
    }

    set(value: T, noTrigger = false, caller?: any) {
        var oldValue = this._value;
        this._value = value;
        if (!noTrigger) {
            this._trigger(value, oldValue, caller);
        }
    }

    static on(parent: any, name: string) {
        return new ObservableProperty(parent, name);
    }
}
