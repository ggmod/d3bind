import {ObservableHandler} from './observable';
import ObservableList from './list';
import AbstractObservable from './abstract';


export default class ObservableListLength extends AbstractObservable<number> {

    constructor(private _list: ObservableList<any>) {
        super();

        _list.subscribe({
            insert: () => {
                this._trigger(_list.length, _list.length - 1);
            },
            remove: () => {
                this._trigger(_list.length, _list.length + 1);
            }
        });
    }

    get(): number {
        return this._list.length;
    }
}
