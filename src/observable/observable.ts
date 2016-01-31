
export type ObservableHandler<T> = (newValue: T, oldValue: T) => void;

export interface Observable<T> {
    get() : T,
    subscribe(handler: ObservableHandler<T>): () => void,
    unsubscribe(handler: ObservableHandler<T>): void,
    unsubscribeAll(): void
}

export interface WritableObservable<T> extends Observable<T> {
    set(value: T, noTrigger?: boolean): void
}

export default Observable;
