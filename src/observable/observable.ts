
export type ObservableHandler<T> = (newValue: T, oldValue: T) => void;

interface Observable<T> {
    get() : T,
    set(value: T, noTrigger?: boolean): void,
    subscribe(handler: ObservableHandler<T>): () => void,
    unsubscribe(handler: ObservableHandler<T>): void,
    unsubscribeAll(): void
}

export default Observable;
