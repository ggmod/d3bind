import {D3Selection} from "../selection";
import d3bind from '../root';
import {addBindingFunctionsToSelection} from '../core/override-utils';


d3bind.wrap = function(d3Selection: D3Selection) {
    return addBindingFunctionsToSelection(d3Selection);
};
