import selection, {D3BindSelection} from "../selection";
import {unbindSelection, unbindSelectionField} from '../bindings/unbind';


selection.unbindText = function(): D3BindSelection {
    unbindSelectionField(this, 'text');
    return this;
};

selection.unbindHtml = function(): D3BindSelection {
    unbindSelectionField(this, 'html');
    return this;
};

selection.unbindClassed = function(className: string): D3BindSelection {
    unbindSelectionField(this, 'classed:' + className);
    return this;
};

selection.unbindStyle = function(styleName: string): D3BindSelection {
    unbindSelectionField(this, 'style:' + styleName);
    return this;
};

selection.unbindAttr = function(attr: string): D3BindSelection {
    unbindSelectionField(this, 'attr:' + attr);
    return this;
};

selection.unbindProperty = function(property: string): D3BindSelection {
    unbindSelectionField(this, 'property:' + property);
    return this;
};


selection.unbind = function(descendants = false): D3BindSelection {
    unbindSelection(this, descendants);
    return this;
};
