import {Observable, ObservableHandler} from './observable';
import ObservableList from './list';


export default class ObservableListLength implements Observable<number> {

    private _subscribers: ObservableHandler<number>[] = [];

    constructor(private _list: ObservableList<any>) {
        _list.subscribe({
            insert: () => {
                this._trigger(_list.length - 1, _list.length);
            },
            remove: () => {
                this._trigger(_list.length + 1, _list.length);
            }
        });
    }

    get(): number {
        return this._list.length;
    }

    subscribe(handler: ObservableHandler<number>): () => void {
        this._subscribers.push(handler);
        return function() { this.unsubscribe(handler); };
    }

    unsubscribe(handler: ObservableHandler<number>) {
        var index = this._subscribers.indexOf(handler);
        if (index >= 0) {
            this._subscribers.splice(index, 1);
        }
    }

    unsubscribeAll() {
        this._subscribers = [];
    }

    private _trigger(oldValue: number, newValue: number) {
        this._subscribers.forEach(subscriber => {
            subscriber.call(null, newValue, oldValue);
        });
    }

    trigger() {
        this._trigger(this._list.length, this._list.length);
    }
}
