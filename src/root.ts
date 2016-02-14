import {D3Selector, D3BindSelector} from "./selector";
import ObservableList from './observable/list';
import ObservableMap from './observable/map';
import ObservableValue from './observable/value';
import ObservableProperty from './observable/property';
import {ObservableScales, ObservableTimeScales} from './scales/scales-interface';
import {scales, timeScales} from './scales/scales-wrapper';


export interface D3Bind {
    select(selectorText: string): D3BindSelector,
    select(node: EventTarget): D3BindSelector,
    selectAll(selectorText: string): D3BindSelector,
    selectAll(nodes: EventTarget[]): D3BindSelector,
    selection(): D3BindSelector,

    wrap(selector: D3Selector): D3BindSelector,

    observe(object: any): any,
    deepObserve(object: any): any,

    ObservableList: typeof ObservableList,
    ObservableMap: typeof ObservableMap,
    ObservableProperty: typeof ObservableProperty,
    ObservableValue: typeof ObservableValue

    scale: ObservableScales,
    time: { scale: ObservableTimeScales }
}

const d3bind: D3Bind = <D3Bind>{};

d3bind.ObservableList = ObservableList;
d3bind.ObservableMap = ObservableMap;
d3bind.ObservableProperty = ObservableProperty;
d3bind.ObservableValue = ObservableValue;

d3bind.scale = scales;
d3bind.time = { scale: timeScales };

export default d3bind;
