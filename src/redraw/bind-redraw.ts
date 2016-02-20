import {subscribe} from '../bindings/helpers';
import selector, {D3BindSelector} from "../selector";
import Observable from '../observable/observable';
import {setUnbindForSelectorField, unbindSelectorField} from '../bindings/unbind';


function redraw<T>(selector: D3BindSelector, observable: Observable<T>, renderer: (model: T, parent: D3BindSelector) => void): void;
function redraw(selector: D3BindSelector, observable: Observable<any>[], renderer: (...params: any[]) => void): void;
function redraw(selector: D3BindSelector, observable: any, renderer: () => void): void {

    selector.selectAll("*").remove();

    if (observable instanceof Array) {
        renderer.apply(selector, observable.map((observableItem: Observable<any>) => observableItem.get()).concat(selector));
    } else {
        renderer.call(selector, observable.get(), selector);
    }
}

function bindRedraw<T>(observable: Observable<T>, renderer: (model: T, parent: D3BindSelector) => void): D3BindSelector;
function bindRedraw(observable: Observable<any>[], renderer: (...params: any[]) => void): D3BindSelector;
function bindRedraw(observable: any, renderer: () => void): D3BindSelector {
    redraw(this, observable, renderer);

    var unsubscribeFunc = subscribe(observable, () => {
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
