import d3bind from '../root';
import {addBindingFunctionsToSelector} from "../helpers";


d3bind.select = function (selectorText: string) {
    var selector = d3.select(selectorText);
    return addBindingFunctionsToSelector(selector);
};
