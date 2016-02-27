import {ObservableHandler} from './observable';
import ObservableSet from './set';
import AbstractObservable from './abstract';


export default class ObservableSetSize extends AbstractObservable<number> {

    constructor(private _set: ObservableSet<any>) {
        super();

        _set.subscribe({
            insert: () => {
                this._trigger(_set.size, _set.size - 1);
            },
            remove: () => {
                this._trigger(_set.size, _set.size + 1);
            }
        });
    }

    get(): number {
        return this._set.size;
    }
}
