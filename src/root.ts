import {D3BindSelector} from "./selector";


export interface D3Bind {
    select: (selectorText: string) => D3BindSelector,
    observe: (object: any) => any;
}

const d3bind: D3Bind = <D3Bind>{};
export default d3bind;
