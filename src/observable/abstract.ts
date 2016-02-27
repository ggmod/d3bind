import Observable, {ObservableHandler} from "./observable";
import Logger from '../utils/logger';


abstract class AbstractObservable<T> implements Observable<T> {

    protected _subscribers: ObservableHandler<T>[] = [];
    private _logger: Logger;

    constructor(protected _name?: string) {
        this._logger = Logger.get((<any>this.constructor).name, _name);
    }

    subscribe(handler: ObservableHandler<T>): () => boolean {
        this._subscribers.push(handler);
        return () => this.unsubscribe(handler);
    }

    unsubscribe(handler: ObservableHandler<T>): boolean {
        var index = this._subscribers.indexOf(handler);
        if (index >= 0) {
            this._subscribers.splice(index, 1);
            return true;
        }
        return false;
    }

    unsubscribeAll(): number {
        var count = this._subscribers.length;
        this._subscribers = [];
        return count;
    }

    protected _trigger(newValue: T, oldValue: T, caller?: any) {
        this._logger.logIndent(newValue, 'oldValue:', oldValue, 'caller:', caller);

        this._subscribers.forEach(subscriber => {
            subscriber.call(null, newValue, oldValue, caller);
        });

        this._logger.logUnindent();
    }

    trigger(caller?: any) {
        var value = this.get();
        this._trigger(value, value, caller);
    }

    abstract get(): T;
}

export default AbstractObservable;
