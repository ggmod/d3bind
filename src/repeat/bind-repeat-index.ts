import BindRepeat from './bind-repeat.ts';
import {ObservableHandler} from '../observable/observable';
import BindRepeatEvent from "./bind-repeat";
import AbstractObservable from '../observable/abstract';


export default class BindRepeatIndexProxy extends AbstractObservable<number> {

    constructor(private id: number, private bindRepeat: BindRepeat<any>) {
        super();
    }

    _trigger(caller?: any) {
        var { newValue, oldValue } = this.bindRepeat.getCurrentAndPreviousValueOfItem(this.id);
        super._trigger(newValue, oldValue, caller);
    }

    get(): number {
        return this.bindRepeat.getCurrentValueOfItem(this.id);
    }
}
