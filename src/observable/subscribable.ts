
export default class Subscribable<Handler> {

    protected _subscribers: Handler[] = [];

    subscribe(handler: Handler): () => boolean {
        this._subscribers.push(handler);
        return () => this.unsubscribe(handler);
    }

    unsubscribe(handler: Handler): boolean {
        var index = this._subscribers.indexOf(handler);
        if (index >= 0) {
            this._subscribers.splice(index, 1);
            return true;
        }
        return false;
    }

    unsubscribeAll(): number {
        var count = this._subscribers.length;
        this._subscribers = [];
        return count;
    }
}
