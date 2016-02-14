import Observable, {WritableObservable} from "../observable/observable";


export interface ObservableScale<Domain, Range, Output> {

    (x: number): Output;

    domain(): Domain[],
    domain(domain: Domain[]): this,

    bindDomain(observable: Observable<Domain[]>): this,
    bindDomain<T>(observable: Observable<T>, converter: (input: T) => Domain[]): this,
    bindDomain(observable: Observable<any>[], converter: (...params: any[]) => Domain[]): this;

    $domain: WritableObservable<Domain[]>

    range(): Range[],
    range(range: Range[]): this,

    bindRange(observable: Observable<Range[]>): this,
    bindRange<T>(observable: Observable<T>, converter: (input: T) => Range[]): this,
    bindRange(observable: Observable<any>[], converter: (...params: any[]) => Range[]): this;

    $range: WritableObservable<Range[]>

    copy(): this
}

export interface ObservableInvertibleScale<Domain, Range, Output> extends ObservableScale<Domain, Range, Output> {
    invert(y: number): Domain;
    ticks(count?: number): Domain[];
    tickFormat(count?: number, format?: string): (t: Domain) => string;
}

export interface ObservableUninvertibleScale<Domain, Range, Output> extends ObservableScale<Domain, Range, Output> {
    invertExtent(y: Range): [Domain, Domain];
}

export type interpolateFactory<Range, Output> = (a: Range, b: Range) => (t: number) => Output;

export interface ObservableMathScale<Domain, Range, Output> extends ObservableInvertibleScale<Domain, Range, Output> {

    interpolate(): interpolateFactory<Range, Output>;
    interpolate(factory: interpolateFactory<Range, Output>): this;

    bindInterpolate(observable: Observable<interpolateFactory<Range, Output>>): this,
    bindInterpolate<T>(observable: Observable<T>, converter: (input: T) => interpolateFactory<Range, Output>): this,
    bindInterpolate(observable: Observable<any>[], converter: (...params: any[]) => interpolateFactory<Range, Output>): this;

    $interpolate: WritableObservable<interpolateFactory<Range, Output>>


    clamp(): boolean;
    clamp(clamp: boolean): this;

    bindClamp(observable: Observable<boolean>): this,
    bindClamp<T>(observable: Observable<T>, converter: (input: T) => boolean): this,
    bindClamp(observable: Observable<any>[], converter: (...params: any[]) => boolean): this;

    $clamp: WritableObservable<boolean>


    nice(count?: number): this;
    rangeRound(values: number[]): this;
}

export interface ObservableIdentityScale extends ObservableInvertibleScale<number, number, number> {}

export interface ObservableLinearScale<Range, Output> extends ObservableMathScale<number, Range, Output> {}

export interface ObservablePowScale<Range, Output> extends ObservableMathScale<number, Range, Output> {
    exponent(): number;
    exponent(k: number): this;

    bindExponent(observable: Observable<number>): this,
    bindExponent<T>(observable: Observable<T>, converter: (input: T) => number): this,
    bindExponent(observable: Observable<any>[], converter: (...params: any[]) => number): this;

    $exponent: WritableObservable<number>,
}

export interface ObservableLogScale<Range, Output> extends ObservableMathScale<number, Range, Output> {
    base(): number;
    base(base: number): this;

    bindBase(observable: Observable<number>): this,
    bindBase<T>(observable: Observable<T>, converter: (input: T) => number): this,
    bindBase(observable: Observable<any>[], converter: (...params: any[]) => number): this;

    $base: WritableObservable<number>,

    // override:
    ticks(): number[];
    nice(): this
}

export interface ObservableQuantizeScale<Range> extends ObservableUninvertibleScale<number, Range, Range> {}

export interface ObservableQuantileScale<Range> extends ObservableUninvertibleScale<number, Range, Range> {
    quantiles(): number[];
}

export interface ObservableThresholdScale<Domain, Range> extends ObservableUninvertibleScale<Domain, Range, Range> {}

export interface ObservableOrdinalScale<Domain extends { toString(): string }, Range> extends ObservableScale<Domain, Range, Range> {
    rangePoints(interval: [number, number], padding?: number): this;
    rangeRoundPoints(interval: [number, number], padding?: number): this;

    rangeBands(interval: [number, number], padding?: number, outerPadding?: number): this;
    rangeRoundBands(interval: [number, number], padding?: number, outerPadding?: number): this;

    rangeBand(): number;
    rangeExtent(): [number, number];
}

export interface ObservableTimeScale<Range, Output> extends ObservableMathScale<Date, Range, Output> {

    // override Domain: the getter always returns Dates, but the setters can accept numbers too

    domain(): Date[],
    domain(domain: Date[] | number[]): this,

    bindDomain(observable: Observable<Date[] | number[]>): this,
    bindDomain<T>(observable: Observable<T>, converter: (input: T) => (Date[] | number[])): this,
    bindDomain(observable: Observable<any>[], converter: (...params: any[]) => (Date[] | number[])): this;

    // simple overrides:

    nice(): this;
    nice(interval: d3.time.Interval, step?: number): this;

    ticks(): Date[];
    ticks(count: number): Date[];
    ticks(interval: d3.time.Interval, step?: number): Date[];

    tickFormat(count: number): (d: Date) => string;
}


export interface ObservableScales {

    linear(): ObservableLinearScale<number, number>;
    linear<Output>(): ObservableLinearScale<Output, Output>;
    linear<Range, Output>(): ObservableLinearScale<Range, Output>;

    sqrt(): ObservablePowScale<number, number>;
    sqrt<Output>(): ObservablePowScale<Output, Output>;
    sqrt<Range, Output>(): ObservablePowScale<Range, Output>;

    pow(): ObservablePowScale<number, number>;
    pow<Output>(): ObservablePowScale<Output, Output>;
    pow<Range, Output>(): ObservablePowScale<Range, Output>;

    log(): ObservableLogScale<number, number>;
    log<Output>(): ObservableLogScale<Output, Output>;
    log<Range, Output>(): ObservableLogScale<Range, Output>;

    identity(): ObservableIdentityScale;

    quantize<T>(): ObservableQuantizeScale<T>;
    quantile<T>(): ObservableQuantileScale<T>;
    threshold<Range>(): ObservableThresholdScale<number, Range>;
    threshold<Domain, Range>(): ObservableThresholdScale<Domain, Range>;

    ordinal<Range>(): ObservableOrdinalScale<string, Range>;
    ordinal<Domain extends { toString(): string }, Range>(): ObservableOrdinalScale<Domain, Range>;
    category10(): ObservableOrdinalScale<string, string>;
    category10<Domain extends { toString(): string }>(): ObservableOrdinalScale<Domain, string>;
    category20(): ObservableOrdinalScale<string, string>;
    category20<Domain extends { toString(): string }>(): ObservableOrdinalScale<Domain, string>;
    category20b(): ObservableOrdinalScale<string, string>;
    category20b<Domain extends { toString(): string }>(): ObservableOrdinalScale<Domain, string>;
    category20c(): ObservableOrdinalScale<string,string>;
    category20c<Domain extends { toString(): string }>(): ObservableOrdinalScale<Domain, string>;
}

export interface ObservableTimeScales {
    (): ObservableTimeScale<number, number>;
    <Output>(): ObservableTimeScale<Output, Output>;
    <Range, Output>(): ObservableTimeScale<Range, Output>;

    utc(): ObservableTimeScale<number, number>;
    utc<Output>(): ObservableTimeScale<Output, Output>;
    utc<Range, Output>(): ObservableTimeScale<Range, Output>;
}
