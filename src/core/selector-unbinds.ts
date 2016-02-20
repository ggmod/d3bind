import selector, {D3BindSelector} from "../selector";
import {unbindSelector, unbindSelectorField} from '../bindings/unbind';


selector.unbindText = function(): D3BindSelector {
    unbindSelectorField(this, 'text');
    return this;
};

selector.unbindHtml = function(): D3BindSelector {
    unbindSelectorField(this, 'html');
    return this;
};

selector.unbindClassed = function(className: string): D3BindSelector {
    unbindSelectorField(this, 'classed:' + className);
    return this;
};

selector.unbindStyle = function(styleName: string): D3BindSelector {
    unbindSelectorField(this, 'style:' + styleName);
    return this;
};

selector.unbindAttr = function(attr: string): D3BindSelector {
    unbindSelectorField(this, 'attr:' + attr);
    return this;
};

selector.unbindProperty = function(property: string): D3BindSelector {
    unbindSelectorField(this, 'property:' + property);
    return this;
};


selector.unbind = function(descendants = false): D3BindSelector {
    unbindSelector(this, descendants);
    return this;
};
