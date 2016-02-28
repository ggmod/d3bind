import {D3Selector, D3BindSelector} from "./selector";
import ObservableArray from './observable/array';
import ObservableMap from './observable/map';
import ObservableSet from "./observable/set";
import ObservableValue from './observable/value';
import ObservableView from './observable/view';
import {ObservableScales, ObservableTimeScales} from './scales/scales-interface';


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
    ObservableSet: typeof ObservableSet,
    ObservableValue: typeof ObservableValue,
    ObservableView: typeof ObservableView,

    scale: ObservableScales,
    time: { scale: ObservableTimeScales }

    logging: boolean
}

const d3bind: D3Bind = <D3Bind>{};
export default d3bind;
