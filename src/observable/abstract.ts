import Observable, {ObservableHandler} from "./observable";


abstract class AbstractObservable<T> implements Observable<T> {

    protected _subscribers: ObservableHandler<T>[] = [];

    subscribe(handler: ObservableHandler<T>): () => void {
        this._subscribers.push(handler);
        return function() { this.unsubscribe(handler); };
    }

    unsubscribe(handler: ObservableHandler<T>): boolean {
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

    protected _trigger(newValue: T, oldValue: T, caller?: any) {
        this._subscribers.forEach(subscriber => {
            subscriber.call(null, newValue, oldValue, caller);
        });
    }

    trigger(caller?: any) {
        var value = this.get();
        this._trigger(value, value, caller);
    }

    abstract get(): T;
}

export default AbstractObservable;
