import {D3Selector} from "../selector";
import d3bind from '../root';
import {addBindingFunctionsToSelector} from '../core/override-utils';


d3bind.wrap = function(d3Selector: D3Selector) {
    return addBindingFunctionsToSelector(d3Selector);
};
