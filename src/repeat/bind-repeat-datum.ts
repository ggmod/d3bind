import BindRepeat from './bind-repeat.ts';
import BindRepeatEvent from "./bind-repeat";
import AbstractObservable from '../observable/abstract';
import {ObservableHandler, WritableObservable} from "../observable/observable";
import BindRepeatIndexProxy from "./bind-repeat-index";


export default class BindRepeatDatumProxy<T> extends AbstractObservable<T> implements WritableObservable<T> {

    constructor(private id: number, private bindRepeat: BindRepeat<any>) {
        super();
    }

    // override private to public
    _trigger(newValue: T, oldValue: T, caller?: any) {
        super._trigger(newValue, oldValue, caller);
    }

    get(): T {
        var index = this.bindRepeat.getCurrentValueOfItem(this.id);
        return this.bindRepeat.modelList.get(index);
    }

    set(value: T, noTrigger = false, caller?: any) {
        var index = this.bindRepeat.getCurrentValueOfItem(this.id);
        this.bindRepeat.modelList.set(index, value, noTrigger, caller);
    }
}
