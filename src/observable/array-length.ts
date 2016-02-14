import {ObservableHandler} from './observable';
import ObservableArray from './array';
import AbstractObservable from './abstract';


export default class ObservableArrayLength extends AbstractObservable<number> {

    constructor(private _list: ObservableArray<any>) {
        super();

        _list.subscribe({
            insert: () => {
                this._trigger(_list.length, _list.length - 1);
            },
            remove: () => {
                this._trigger(_list.length, _list.length + 1);
            },
            replace: () => {}
        });
    }

    get(): number {
        return this._list.length;
    }
}
