import selection, {D3Selection, D3BindSelection} from "../selection";
import ObservableArray from "../observable/array";
import Observable, {ObservableHandler} from '../observable/observable'
import BindRepeatIndexProxy from './bind-repeat-index';
import BindRepeatDatumProxy from "./bind-repeat-datum";
import {WritableObservable} from "../observable/observable";
import {setUnbindForSelectionField, unbindSelectionField} from '../bindings/unbind';
import Logger from '../utils/logger';


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
    selection: D3BindSelection,
    indexProxy: BindRepeatIndexProxy,
    datumProxy: BindRepeatDatumProxy<T>
}

export interface BindRepeatOptions {
    customReplace: boolean
}

export type BindRepeatRenderer<T> = (modelItem: T | WritableObservable<T>, index: Observable<number>, parent: D3BindSelection) => void;


export default class BindRepeat<T> {

    private selectionProxy: D3BindSelection;

    private repeatItems: BindRepeatItem<T>[] = [];
    private repeatItemsById: { [id: string]: BindRepeatItem<T>} = {};

    // state variables, the source of all evil
    private currentIndex: number;
    private currentEvent: BindRepeatEvent;

    indexSubscriberCount = 0;
    datumSubscriberCount = 0;

    private itemCounter = 0;

    private logger: Logger;

    constructor(
        public modelList: ObservableArray<T>,
        private renderer: BindRepeatRenderer<T>,
        private options: BindRepeatOptions = <BindRepeatOptions>{},
        private selection: D3BindSelection
    ) {
        this.logger = Logger.get('Selection', 'repeat');

        this.selectionProxy = this.createSelectionProxy();

        this.build();

        var unsubscribeFunc = modelList.subscribe({
            insert: (item, index) => { this.onInsert(item, index); },
            remove: (item, index) => { this.onRemove(item, index); },
            replace: options.customReplace ? (item, index, oldValue, caller) => { this.onReplace(item, index, oldValue, caller); } : undefined
        });

        setUnbindForSelectionField(selection, 'repeat', () => unsubscribeFunc() ? 1 : 0);
    }

    private createRepeatItem() {
        var id = this.itemCounter++;
        var indexProxy = new BindRepeatIndexProxy(id, this);
        var datumProxy = this.options.customReplace ? new BindRepeatDatumProxy<T>(id, this) : null;

        var repeatItem = <BindRepeatItem<T>>{
            id: id,
            selection: null,
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

    private build() {
        this.currentEvent = BindRepeatEvent.BUILD;

        for (this.currentIndex = 0; this.currentIndex < this.modelList.length; this.currentIndex++) {

            var { indexProxy, datumProxy } = this.createRepeatItem();
            var modelItem = this.modelList.get(this.currentIndex);
            var rendererItem = this.options.customReplace ? datumProxy : modelItem;
            this.renderer.call(this.selectionProxy, rendererItem, indexProxy, this.selectionProxy); // 'this' passed in twice, intentional redundancy
        }

        this.currentEvent = null;
        this.currentIndex = null;
    }

    private onInsert(item: T, index: number) {
        this.logger.log('insert', item, 'index:', index);

        this.currentEvent = BindRepeatEvent.INSERT;
        this.currentIndex = index;

        var { indexProxy, datumProxy } = this.createRepeatItem();
        var rendererItem = this.options.customReplace ? datumProxy : item;
        this.renderer.call(this.selectionProxy, rendererItem, indexProxy, this.selectionProxy);

        this.currentEvent = BindRepeatEvent.INSERT_REINDEXING;
        this.currentIndex++;
        this.updateIndexes();

        this.currentEvent = null;
        this.currentIndex = null;
    }

    private onRemove(item: T, index: number) {
        this.logger.log('remove', item, 'index:', index);

        this.currentEvent = BindRepeatEvent.REMOVE;
        this.currentIndex = index;

        var itemToRemove = this.repeatItems.splice(index, 1)[0];
        delete this.repeatItemsById[itemToRemove.id];

        itemToRemove.selection.remove();
        itemToRemove.indexProxy.unsubscribeAll();
        if (itemToRemove.datumProxy) {
            itemToRemove.datumProxy.unsubscribeAll();
        }

        this.currentEvent = BindRepeatEvent.REMOVE_REINDEXING;
        this.updateIndexes();

        this.currentEvent = null;
        this.currentIndex = null;
    }

    private onReplace(item: T, index: number, oldValue: T, caller: any) {
        this.logger.log('replace', item, 'index:', index, 'oldValue:', oldValue, 'caller:', caller);

        this.currentEvent = BindRepeatEvent.REPLACE;
        this.currentIndex = index;

        var repeatItem = this.repeatItems[index];
        repeatItem.datumProxy._trigger(item, oldValue, caller);

        this.currentEvent = null;
        this.currentIndex = null;
    }

    private updateIndexes() {
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

    private createSelectionProxy(): D3BindSelection {
        var proxy: D3BindSelection = Object.create(this.selection);
        proxy.append = (input: any): D3BindSelection => {
            return this.insertRepeatItem(input);
        };
        proxy.insert = (input: any, before: any): D3BindSelection => {
            if (before !== undefined) throw "before parameter of .insert() not supported inside bindRepeat";
            return this.insertRepeatItem(input);
        };
        return proxy;
    }

    private insertRepeatItem(input: string): D3BindSelection;
    private insertRepeatItem(input: () => EventTarget): D3BindSelection;
    private insertRepeatItem(input: any): D3BindSelection {
        if (this.currentIndex == null) {
            // TODO this.getCurrentIndexOfSelectionProxy(); - but there would be N different selection proxies then
            throw "the bindRepeat render function must call the append/insert method synchronously!";
        }
        var i = this.currentIndex;

        var newItem: D3BindSelection = null;
        if (i >= this.repeatItems.length) {
            newItem = this.selection.append(input);
        } else {
            /* I wanted to use something like '> :nth-child($i+1)', but querySelector and thus d3 .insert() doesn't support
             selectors for direct children only, except with polyfills:
             http://stackoverflow.com/questions/6481612/queryselector-search-immediate-children */
            newItem = this.selection.insert(input, () => this.selection.node().childNodes[i]);
        }

        this.repeatItems[i].selection = newItem;
        return newItem;
    }
}

function bindRepeat<T>(modelList: ObservableArray<T>, renderer: BindRepeatRenderer<T>, options?: BindRepeatOptions): D3BindSelection {
    this.node()[REPEAT_PREFIX] = new BindRepeat<T>(modelList, renderer, options, this);
    return this;
}
selection.bindRepeat = bindRepeat;


selection.unbindRepeat = function(): D3BindSelection {
    unbindSelectionField(this, 'repeat');

    var repeatItems: BindRepeatItem<any>[] = this.node()[REPEAT_PREFIX].repeatItems;

    repeatItems.forEach(repeatItem => {
        repeatItem.indexProxy.unsubscribeAll();
        if (repeatItem.datumProxy) {
            repeatItem.datumProxy.unsubscribeAll();
        }
    });

    return this;
};
