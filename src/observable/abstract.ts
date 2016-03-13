import Observable, {ObservableHandler} from "./observable";
import Logger from '../utils/logger';
import Subscribable from "./subscribable";


abstract class AbstractObservable<T> extends Subscribable<ObservableHandler<T>> implements Observable<T> {

    private _logger: Logger;

    constructor(protected _name?: string) {
        super();
        this._logger = Logger.get((<any>this.constructor).name, _name);
    }

    protected _trigger(newValue: T, oldValue: T, caller?: any) {
        this._logger.logIndent(newValue, '| oldValue:', oldValue, '| caller:', caller);

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
