import {D3Selection, D3BindSelection, D3Transition, D3BindTransition} from "../selection";
import {unbindSelection} from '../bindings/unbind';


export default function overrideTransition(selection: D3BindSelection, superTransition: D3Transition): D3BindTransition {

    var transition: D3BindTransition = Object.create(superTransition);

    transition.remove = function(keepBindings?: boolean): D3BindTransition {
        superTransition.remove();

        if (!keepBindings) {
            unbindSelection(selection, true);
        }

        return this;
    };

    transition.transition = function() {
        var superSubTransition = superTransition.transition();
        return overrideTransition(selection, superSubTransition);
    };

    transition.select = function(selector: any) {
        var superSubTransition = superTransition.select(selector);
        var subSelection = selection.select(selector);
        return overrideTransition(subSelection, superSubTransition);
    };

    transition.selectAll = function(selector: any) {
        var superSubTransition = superTransition.selectAll(selector);
        var subSelection = selection.selectAll(selector);
        return overrideTransition(subSelection, superSubTransition);
    };

    transition.filter = function(selector: any) {
        var superSubTransition = superTransition.filter(selector);
        var subSelection = selection.filter(selector);
        return overrideTransition(subSelection, superSubTransition);
    };

    return transition;
}
