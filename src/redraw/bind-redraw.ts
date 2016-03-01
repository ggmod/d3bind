import {subscribe} from '../observable/helpers';
import selection, {D3BindSelection} from "../selection";
import Observable from '../observable/observable';
import {setUnbindForSelectionField, unbindSelectionField} from '../bindings/unbind';
import Logger from '../utils/logger';


function redraw<T>(selection: D3BindSelection, observable: Observable<T>, renderer: (model: T, parent: D3BindSelection) => void): void;
function redraw(selection: D3BindSelection, observable: Observable<any>[], renderer: (...params: any[]) => void): void;
function redraw(selection: D3BindSelection, observable: any, renderer: () => void): void {

    selection.selectAll("*").remove();

    if (observable instanceof Array) {
        renderer.apply(selection, observable.map((item: Observable<any>) => item.get()).concat(selection));
    } else {
        renderer.call(selection, observable.get(), selection);
    }
}

function bindRedraw<T>(observable: Observable<T>, renderer: (model: T, parent: D3BindSelection) => void): D3BindSelection;
function bindRedraw(observable: Observable<any>[], renderer: (...params: any[]) => void): D3BindSelection;
function bindRedraw(observable: any, renderer: () => void): D3BindSelection {
    var logger = Logger.get('Selection', 'redraw');
    redraw(this, observable, renderer);

    var unsubscribeFunc = subscribe(observable, () => null, (newValue, oldValue, caller) => {
        logger.log('caller:', caller);
        redraw(this, observable, renderer);
    });

    setUnbindForSelectionField(this, 'redraw', unsubscribeFunc);

    return this;
}
selection.bindRedraw = bindRedraw;


selection.unbindRedraw = function(): D3BindSelection {
    unbindSelectionField(this, 'redraw');
    return this;
};
