import {subscribe} from '../observable/helpers';
import selector, {D3BindSelector} from "../selector";
import Observable from '../observable/observable';
import {setUnbindForSelectorField, unbindSelectorField} from '../bindings/unbind';
import Logger from '../utils/logger';


function redraw<T>(selector: D3BindSelector, observable: Observable<T>, renderer: (model: T, parent: D3BindSelector) => void): void;
function redraw(selector: D3BindSelector, observable: Observable<any>[], renderer: (...params: any[]) => void): void;
function redraw(selector: D3BindSelector, observable: any, renderer: () => void): void {

    selector.selectAll("*").remove();

    if (observable instanceof Array) {
        renderer.apply(selector, observable.map((item: Observable<any>) => item.get()).concat(selector));
    } else {
        renderer.call(selector, observable.get(), selector);
    }
}

function bindRedraw<T>(observable: Observable<T>, renderer: (model: T, parent: D3BindSelector) => void): D3BindSelector;
function bindRedraw(observable: Observable<any>[], renderer: (...params: any[]) => void): D3BindSelector;
function bindRedraw(observable: any, renderer: () => void): D3BindSelector {
    var logger = Logger.get('Selector', 'redraw');
    redraw(this, observable, renderer);

    var unsubscribeFunc = subscribe(observable, () => null, (newValue, oldValue, caller) => {
        logger.log('caller:', caller);
        redraw(this, observable, renderer);
    });

    setUnbindForSelectorField(this, 'redraw', unsubscribeFunc);

    return this;
}
selector.bindRedraw = bindRedraw;


selector.unbindRedraw = function(): D3BindSelector {
    unbindSelectorField(this, 'redraw');
    return this;
};
