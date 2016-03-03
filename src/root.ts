import {D3Selection, D3BindSelection} from "./selection";
import ObservableArray from './observable/array';
import ObservableMap from './observable/map';
import ObservableSet from "./observable/set";
import ObservableValue from './observable/value';
import ObservableView from './observable/view';
import {ObservableScales, ObservableTimeScales} from './scales/scales-interface';
import D3BindTransition from './transition/transition';


export interface D3Bind {
    select(selectorText: string): D3BindSelection,
    select(node: EventTarget): D3BindSelection,
    selectAll(selectorText: string): D3BindSelection,
    selectAll(nodes: EventTarget[]): D3BindSelection,
    selection(): D3BindSelection,

    wrap(selection: D3Selection): D3BindSelection,

    observable(object: any): any,
    deepObservable(object: any): any,

    ObservableArray: typeof ObservableArray,
    ObservableMap: typeof ObservableMap,
    ObservableSet: typeof ObservableSet,
    ObservableValue: typeof ObservableValue,
    ObservableView: typeof ObservableView,

    transition: () => D3BindTransition;

    scale: ObservableScales,
    time: { scale: ObservableTimeScales }

    logging: boolean
}

const d3bind: D3Bind = <D3Bind>{};
export default d3bind;
