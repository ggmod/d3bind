
export type ObservableHandler<T> = (newValue: T, oldValue: T, caller?: any) => void;

export interface Observable<T> {
    get() : T,
    subscribe(handler: ObservableHandler<T>): () => boolean,
    unsubscribe(handler: ObservableHandler<T>): boolean,
    unsubscribeAll(): number,
    trigger(): void
}

export interface WritableObservable<T> extends Observable<T> {
    set(value: T, noTrigger?: boolean, caller?: any): void
}

export default Observable;
