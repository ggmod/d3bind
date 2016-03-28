import ObservableSet from './set';
import Observable from './observable';
import AbstractObservable from './abstract';


export default class ObservableSetAll<T> extends AbstractObservable<T> {

    constructor(private _set: ObservableSet<T>) {
        super();

        _set.subscribe({
            insert: (item) => {
                this._trigger(item, null);
            },
            remove: (item) => {
                this._trigger(null, item);
            }
        });
    }

    get(): T {
        return null; // Not supported
    }
}
