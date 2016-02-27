import {D3Selector, D3BindSelector} from "./selector";
import ObservableArray from './observable/array';
import ObservableMap from './observable/map';
import ObservableValue from './observable/value';
import ObservableProperty from './observable/property';
import {ObservableScales, ObservableTimeScales} from './scales/scales-interface';
import {scales, timeScales} from './scales/scales-wrapper';
import Logger from './utils/logger';


export interface D3Bind {
    select(selectorText: string): D3BindSelector,
    select(node: EventTarget): D3BindSelector,
    selectAll(selectorText: string): D3BindSelector,
    selectAll(nodes: EventTarget[]): D3BindSelector,
    selection(): D3BindSelector,

    wrap(selector: D3Selector): D3BindSelector,

    observe(object: any): any,
    deepObserve(object: any): any,

    ObservableArray: typeof ObservableArray,
    ObservableMap: typeof ObservableMap,
    ObservableValue: typeof ObservableValue

    scale: ObservableScales,
    time: { scale: ObservableTimeScales }

    logging: boolean
}

const d3bind: D3Bind = <D3Bind>{};

d3bind.ObservableArray = ObservableArray;
d3bind.ObservableMap = ObservableMap;
d3bind.ObservableValue = ObservableValue;

d3bind.scale = scales;
d3bind.time = { scale: timeScales };

Object.defineProperty(d3bind, 'logging', {
    get: () => Logger.enabled,
    set: (value) => Logger.enabled = value
});

export default d3bind;
