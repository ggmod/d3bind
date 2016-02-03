import BindRepeat from './bind-repeat.ts';
import Observable, {ObservableHandler} from '../observable/observable';
import BindRepeatEvent from "./bind-repeat";


export default class BindRepeatIndexProxy implements Observable<number> {

    private _subscribers: ObservableHandler<number>[] = [];

    constructor(private bindRepeat: BindRepeat<any>) { }

    subscribe(handler: ObservableHandler<number>): () => void {
        this.bindRepeat.indexSubscriberCount++;

        this._subscribers.push(handler);
        return function() { this.unsubscribe(handler); };
    }

    unsubscribe(handler: ObservableHandler<number>) {
        var index = this._subscribers.indexOf(handler);
        if (index >= 0) {
            this.bindRepeat.indexSubscriberCount--;

            this._subscribers.splice(index, 1);
        }
    }

    unsubscribeAll() {
        this.bindRepeat.indexSubscriberCount -= this._subscribers.length;
        this._subscribers = [];
    }

    trigger() {
        this._subscribers.forEach(subscriber => {
            var { newValue, oldValue } = this.bindRepeat.getCurrentAndPreviousValueOfIndexProxy(this);
            subscriber.call(null, newValue, oldValue);
        });
    }

    get(): number {
        return this.bindRepeat.getCurrentValueOfIndexProxy(this);
    }
}
