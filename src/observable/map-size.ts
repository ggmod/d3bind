import {ObservableHandler} from './observable';
import ObservableMap from './map';
import AbstractObservable from './abstract';


export default class ObservableMapSize extends AbstractObservable<number> {

    constructor(private _map: ObservableMap<any, any>) {
        super();

        _map.subscribe({
            insert: () => {
                this._trigger(_map.size, _map.size - 1);
            },
            remove: () => {
                this._trigger(_map.size, _map.size + 1);
            },
            replace: () => {}
        });
    }

    get(): number {
        return this._map.size;
    }
}
