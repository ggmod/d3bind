import BindRepeat from './bind-repeat.ts';
import {ObservableHandler} from '../observable/observable';
import BindRepeatEvent from "./bind-repeat";
import AbstractObservable from '../observable/abstract';


export default class BindRepeatIndexProxy extends AbstractObservable<number> {

    constructor(private bindRepeat: BindRepeat<any>) {
        super();
    }

    subscribe(handler: ObservableHandler<number>): () => void {
        this.bindRepeat.indexSubscriberCount++;
        return super.subscribe(handler);
    }

    unsubscribe(handler: ObservableHandler<number>) {
        var success = super.unsubscribe(handler);
        if (success) {
            this.bindRepeat.indexSubscriberCount--;
        }
        return success;
    }

    unsubscribeAll() {
        this.bindRepeat.indexSubscriberCount -= this._subscribers.length;
        super.unsubscribeAll();
    }

    _trigger(caller?: any) {
        var { newValue, oldValue } = this.bindRepeat.getCurrentAndPreviousValueOfIndexProxy(this);
        super._trigger(newValue, oldValue, caller);
    }

    get(): number {
        return this.bindRepeat.getCurrentValueOfIndexProxy(this);
    }
}
