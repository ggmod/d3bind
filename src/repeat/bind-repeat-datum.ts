import BindRepeat from './bind-repeat.ts';
import BindRepeatEvent from "./bind-repeat";
import AbstractObservable from '../observable/abstract';
import {ObservableHandler, WritableObservable} from "../observable/observable";
import BindRepeatIndexProxy from "./bind-repeat-index";


export default class BindRepeatDatumProxy<T> extends AbstractObservable<T> implements WritableObservable<T> {

    constructor(private id: number, private bindRepeat: BindRepeat<any>) {
        super();
    }

    subscribe(handler: ObservableHandler<T>): () => void {
        this.bindRepeat.datumSubscriberCount++;
        return super.subscribe(handler);
    }

    unsubscribe(handler: ObservableHandler<T>) {
        var success = super.unsubscribe(handler);
        if (success) {
            this.bindRepeat.datumSubscriberCount--;
        }
        return success;
    }

    unsubscribeAll() {
        this.bindRepeat.datumSubscriberCount -= this._subscribers.length;
        super.unsubscribeAll();
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
