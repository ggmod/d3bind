import {D3Selector, D3BindSelector} from "./selector";


export interface D3Bind {
    select(selectorText: string): D3BindSelector,
    select(node: EventTarget): D3BindSelector,
    selectAll(selectorText: string): D3BindSelector,
    selectAll(nodes: EventTarget[]): D3BindSelector,
    selection(): D3BindSelector,

    observe(object: any): any,
    deepObserve(object: any): any,

    wrap(selector: D3Selector): D3BindSelector
}

const d3bind: D3Bind = <D3Bind>{};
export default d3bind;
