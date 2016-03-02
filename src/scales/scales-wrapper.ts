import {addObservableSetter} from '../bindings/setter';
import {ObservableScales, ObservableTimeScales} from "./scales-interface";
import {unbindObject} from '../bindings/unbind';


function observableScale(source: any, ctor: any) {

    var scale: any = (x: number) => source(x);

    addObservableSetter(source, scale, 'domain');
    addObservableSetter(source, scale, 'range');

    scale.copy = () => ctor(source.copy());

    scale.unbind = () => {
        unbindObject(scale);
        return scale;
    };

    return scale;
}

function observableInvertibleScale(source: any, ctor: any) {
    var scale = observableScale(source, ctor);

    scale.invert = (...args: any[]) => source.invert(...args);
    scale.ticks = (...args: any[]) => source.ticks(...args);
    scale.tickFormat = (...args: any[]) => source.tickFormat(...args);

    return scale;
}

function observableUninvertibleScale(source: any, ctor: any) {
    var scale = observableScale(source, ctor);
    scale.invertExtent = (...args: any[]) => source.invertExtent(...args);
    return scale;
}

function observableMathScale(source: any, ctor: any) {

    var scale = observableInvertibleScale(source, ctor);

    addObservableSetter(source, scale, 'interpolate');
    addObservableSetter(source, scale, 'clamp');

    scale.nice = (...args: any[]) => {
        source.nice(...args);
        scale.$domain.trigger();
        return scale;
    };
    scale.rangeRound = (...args: any[]) => {
        source.rangeRound(...args);
        scale.$range.trigger();
        scale.$interpolate.trigger();
        return scale;
    };

    return scale;
}

function observableLinearScale(source: d3.scale.Linear<any, any>) {
    return observableMathScale(source, observableLinearScale);
}

function observablePowScale(source: d3.scale.Pow<any, any>) {
    var scale = observableMathScale(source, observablePowScale);
    addObservableSetter(source, scale, 'exponent');
    return scale;
}

function observableLogScale(source: d3.scale.Log<any, any>) {
    var scale = observableMathScale(source, observableLogScale);
    addObservableSetter(source, scale, 'base');
    return scale;
}

function observableIdentityScale(source: d3.scale.Identity) {
    return observableInvertibleScale(source, observableIdentityScale);
}

function observableQuantizeScale(source: d3.scale.Quantize<any>) {
    return observableUninvertibleScale(source, observableQuantizeScale);
}

function observableQuantileScale(source: d3.scale.Quantile<any>) {
    var scale = observableUninvertibleScale(source, observableQuantileScale);
    scale.quantiles = () => source.quantiles();
    return scale;
}

function observableThresholdScale(source: d3.scale.Threshold<any, any>) {
    return observableUninvertibleScale(source, observableThresholdScale);
}

function observableOrdinalScale(source: any /*d3.scale.Ordinal<any, any>  issue #4130 */) {
    var scale = observableScale(source, observableOrdinalScale);

    scale.rangePoints = (...args: any[]) => {
        source.rangePoints(...args);
        scale.$range.trigger();
        return scale;
    };
    scale.rangeRoundPoints = (...args: any[]) => {
        source.rangeRoundPoints(...args);
        scale.$range.trigger();
        return scale;
    };
    scale.rangeBands = (...args: any[]) => {
        source.rangeBands(...args);
        scale.$range.trigger();
        return scale;
    };
    scale.rangeRoundBands = (...args: any[]) => {
        source.rangeRoundBands(...args);
        scale.$range.trigger();
        return scale;
    };

    scale.rangeBand = (...args: any[]) => source.rangeBand(...args);
    scale.rangeExtent = (...args: any[]) => source.rangeExtent(...args);

    return scale;
}

function observableTimeScale(source: d3.time.Scale<any, any>) {
    return observableMathScale(source, observableTimeScale);
}

export const scales: ObservableScales = {
    linear: () => observableLinearScale(d3.scale.linear()),
    pow: () => observablePowScale(d3.scale.pow()),
    sqrt: () => observablePowScale(d3.scale.sqrt()),
    log: () => observableLogScale(d3.scale.log()),
    identity: () => observableIdentityScale(d3.scale.identity()),
    quantize: () => observableQuantizeScale(d3.scale.quantize()),
    quantile: () => observableQuantileScale(d3.scale.quantile()),
    threshold: () => observableThresholdScale(d3.scale.threshold()),
    ordinal: () => observableOrdinalScale(d3.scale.ordinal()),
    category10: () => observableOrdinalScale(d3.scale.category10()),
    category20: () => observableOrdinalScale(d3.scale.category20()),
    category20b: () => observableOrdinalScale(d3.scale.category20b()),
    category20c: () => observableOrdinalScale(d3.scale.category20c())
};

export const timeScales: any = () => observableTimeScale(d3.time.scale());
timeScales.utc = () => observableTimeScale(d3.time.scale.utc());
