import selector, {D3Selector, D3BindSelector} from "../selector";
import ObservableArray from "../observable/array";
import Observable, {ObservableHandler} from '../observable/observable'
import BindRepeatIndexProxy from './bind-repeat-index';
import BindRepeatDatumProxy from "./bind-repeat-datum";
import WritableObservable from "../observable/observable";
import {setUnbindForSelectorField, unbindSelectorField} from '../bindings/unbind';


const REPEAT_PREFIX = '__d3bind_repeat';

enum BindRepeatEvent {
    BUILD,
    INSERT,
    REMOVE,
    REPLACE,
    INSERT_REINDEXING,
    REMOVE_REINDEXING
}

interface BindRepeatItem<T> {
    id: number,
    index: number,
    selector: D3BindSelector,
    indexProxy: BindRepeatIndexProxy,
    datumProxy: BindRepeatDatumProxy<T>
}

export interface BindRepeatOptions {
    customReplace: boolean
}

export type BindRepeatRenderer<T> = (modelItem: T | WritableObservable<T>, index: Observable<number>, parent: D3BindSelector) => void;


export default class BindRepeat<T> {

    selectorProxy: D3BindSelector;

    repeatItems: BindRepeatItem<T>[] = [];
    repeatItemsById: { [id: string]: BindRepeatItem<T>} = {};

    // state variables, the source of all evil
    currentIndex: number;
    currentEvent: BindRepeatEvent;

    indexSubscriberCount = 0;
    datumSubscriberCount = 0;

    itemCounter = 0;

    constructor(
        public modelList: ObservableArray<T>,
        private renderer: BindRepeatRenderer<T>,
        private options: BindRepeatOptions = <BindRepeatOptions>{},
        private selector: D3BindSelector
    ) {

        this.selectorProxy = this.createSelectorProxy();

        this.build();

        var unsubscribeFunc = modelList.subscribe({
            insert: (item, index) => { this.onInsert(item, index); },
            remove: (item, index) => { this.onRemove(item, index); },
            replace: options.customReplace ? (item, index, oldValue, caller) => { this.onReplace(item, index, oldValue, caller); } : undefined
        });

        setUnbindForSelectorField(selector, 'repeat', () => unsubscribeFunc() ? 1 : 0);
    }

    _createRepeatItem() {
        var id = this.itemCounter++;
        var indexProxy = new BindRepeatIndexProxy(id, this);
        var datumProxy = this.options.customReplace ? new BindRepeatDatumProxy<T>(id, this) : null;

        var repeatItem = <BindRepeatItem<T>>{
            id: id,
            selector: null,
            indexProxy: indexProxy,
            datumProxy: datumProxy,
            index: this.currentIndex
        };
        if (this.currentIndex === this.repeatItems.length) {
            this.repeatItems.push(repeatItem);
        } else {
            this.repeatItems.splice(this.currentIndex, 0, repeatItem);
        }
        this.repeatItemsById[id] = repeatItem;

        return { indexProxy, datumProxy };
    }

    build() {
        this.currentEvent = BindRepeatEvent.BUILD;

        for (this.currentIndex = 0; this.currentIndex < this.modelList.length; this.currentIndex++) {

            var { indexProxy, datumProxy } = this._createRepeatItem();
            var modelItem = this.modelList.get(this.currentIndex);
            var rendererItem = this.options.customReplace ? datumProxy : modelItem;
            this.renderer.call(this.selectorProxy, rendererItem, indexProxy, this.selectorProxy); // 'this' passed in twice, intentional redundancy
        }

        this.currentEvent = null;
        this.currentIndex = null;
    }

    onInsert(item: T, index: number) {
        this.currentEvent = BindRepeatEvent.INSERT;
        this.currentIndex = index;

        var { indexProxy, datumProxy } = this._createRepeatItem();
        var rendererItem = this.options.customReplace ? datumProxy : item;
        this.renderer.call(this.selectorProxy, rendererItem, indexProxy, this.selectorProxy);

        this.currentEvent = BindRepeatEvent.INSERT_REINDEXING;
        this.currentIndex++;
        this.updateIndexes();

        this.currentEvent = null;
        this.currentIndex = null;
    }

    onRemove(item: T, index: number) {
        this.currentEvent = BindRepeatEvent.REMOVE;
        this.currentIndex = index;

        var itemToRemove = this.repeatItems.splice(index, 1)[0];
        delete this.repeatItemsById[itemToRemove.id];

        itemToRemove.selector.remove();
        itemToRemove.indexProxy.unsubscribeAll();
        if (itemToRemove.datumProxy) {
            itemToRemove.datumProxy.unsubscribeAll();
        }

        this.currentEvent = BindRepeatEvent.REMOVE_REINDEXING;
        this.updateIndexes();

        this.currentEvent = null;
        this.currentIndex = null;
    }

    onReplace(item: T, index: number, oldValue: T, caller: any) {
        this.currentEvent = BindRepeatEvent.REPLACE;
        this.currentIndex = index;

        var repeatItem = this.repeatItems[index];
        repeatItem.datumProxy._trigger(item, oldValue, caller);

        this.currentEvent = null;
        this.currentIndex = null;
    }

    updateIndexes() {
        // I assume that in most use-cases there will be either no index subscribers, or every item will have some
        if (this.indexSubscriberCount > 0 || this.datumSubscriberCount > 0) {
            for (; this.currentIndex < this.repeatItems.length; this.currentIndex++) {
                this.repeatItems[this.currentIndex].index = this.currentIndex;
                if (this.indexSubscriberCount > 0) {
                    this.repeatItems[this.currentIndex].indexProxy._trigger();
                }
            }
        }
    }

    getCurrentValueOfItem(id: number) {
        if (this.currentIndex !== null) {
            return this.currentIndex;
        } else {
            var index = this.repeatItemsById[id].index;
            if (index == null) throw "bindRepeat index not found!";
            return index;
        }
    }

    getCurrentAndPreviousValueOfItem(id: number) {
        var newValue = this.getCurrentValueOfItem(id);

        var oldValue: number = null;
        if (this.currentEvent === null || BindRepeatEvent.REPLACE) {
            oldValue = newValue;
        } else if (this.currentEvent === BindRepeatEvent.INSERT || this.currentEvent === BindRepeatEvent.REMOVE ||
            this.currentEvent === BindRepeatEvent.BUILD) {
            oldValue = null;
        } else if (this.currentEvent === BindRepeatEvent.INSERT_REINDEXING ||
            this.currentEvent === BindRepeatEvent.REMOVE_REINDEXING) {
            oldValue = this.currentIndex - 1;
        }

        return { newValue, oldValue };
    }

    createSelectorProxy(): D3BindSelector {
        var proxy: D3BindSelector = Object.create(this.selector);
        proxy.append = (input: any): D3BindSelector => {
            return this.insertRepeatItem(input);
        };
        proxy.insert = (input: any, before: any): D3BindSelector => {
            if (before !== undefined) throw "before parameter of .insert() not supported inside bindRepeat";
            return this.insertRepeatItem(input);
        };
        return proxy;
    }

    insertRepeatItem(input: string): D3BindSelector;
    insertRepeatItem(input: () => EventTarget): D3BindSelector;
    insertRepeatItem(input: any): D3BindSelector {
        if (this.currentIndex == null) {
            // TODO this.getCurrentIndexOfSelectorProxy(); - but there would be N different selector proxies then
            throw "the bindRepeat render function must call the append/insert method synchronously!";
        }
        var i = this.currentIndex;

        var newItem: D3BindSelector = null;
        if (i >= this.repeatItems.length) {
            newItem = this.selector.append(input);
        } else {
            /* I wanted to use something like '> :nth-child($i+1)', but querySelector and thus d3 .insert() doesn't support
             selectors for direct children only, except with polyfills:
             http://stackoverflow.com/questions/6481612/queryselector-search-immediate-children */
            newItem = this.selector.insert(input, () => this.selector.node().childNodes[i]);
        }

        this.repeatItems[i].selector = newItem;
        return newItem;
    }
}

function bindRepeat<T>(modelList: ObservableArray<T>, renderer: BindRepeatRenderer<T>, options?: BindRepeatOptions): D3BindSelector {
    this.node()[REPEAT_PREFIX] = new BindRepeat<T>(modelList, renderer, options, this);
    return this;
}
selector.bindRepeat = bindRepeat;


selector.unbindRedraw = function(): D3BindSelector {
    unbindSelectorField(this, 'repeat');

    var repeatItems: BindRepeatItem<any>[] = this.node()[REPEAT_PREFIX].repeatItems;

    repeatItems.forEach(repeatItem => {
        repeatItem.indexProxy.unsubscribeAll();
        if (repeatItem.datumProxy) {
            repeatItem.datumProxy.unsubscribeAll();
        }
    });

    return this;
};
