import selector from '../selector';
import { addBindingFunctionsToSelector } from '../helpers';

selector.append = function(tagName: string) {
    var _super = Object.getPrototypeOf(this);
    var selector = _super.append(tagName);
    return addBindingFunctionsToSelector(selector);
};
