import selector, {D3Selector, D3BindSelector} from "../selector";
import ObservableList from "../observable/list";
import Observable, {ObservableHandler} from '../observable/observable'
import BindRepeatIndexProxy from './bind-repeat-index';


enum BindRepeatEvent {
    BUILD,
    INSERT,
    REMOVE,
    INSERT_REINDEXING,
    REMOVE_REINDEXING
}

interface BindRepeatItem {
    selector: D3BindSelector,
    indexProxy: BindRepeatIndexProxy
}

export default class BindRepeat<T> {

    selectorProxy: D3BindSelector;

    repeatItems: BindRepeatItem[] = [];

    // state variables, the source of all evil
    currentIndex: number;
    currentEvent: BindRepeatEvent;

    indexSubscriberCount = 0;

    constructor(
        private modelList: ObservableList<T>,
        private renderer: (modelItem: T, index: number, parent: D3BindSelector) => void,
        private selector: D3BindSelector
    ) {

        this.selectorProxy = this.createSelectorProxy();

        this.build();

        modelList.subscribe({
            insert: (item, index) => { this.onInsert(item, index); },
            remove: (item, index) => { this.onRemove(item, index); }
        });
    }

    build() {
        this.currentEvent = BindRepeatEvent.BUILD;

        for (this.currentIndex = 0; this.currentIndex < this.modelList.length; this.currentIndex++) {

            var indexProxy = new BindRepeatIndexProxy(this);
            this.repeatItems.push(<BindRepeatItem>{
                indexProxy: indexProxy,
                selector: null
            });
            var modelItem = this.modelList.get(this.currentIndex);
            this.renderer.call(this.selectorProxy, modelItem, indexProxy, this.selectorProxy); // 'this' passed in twice, intentional redundancy
        }

        this.currentEvent = null;
        this.currentIndex = null;
    }

    onInsert(item: T, index: number) {
        this.currentEvent = BindRepeatEvent.INSERT;
        this.currentIndex = index;

        var indexProxy = new BindRepeatIndexProxy(this);
        this.repeatItems.splice(this.currentIndex, 0, <BindRepeatItem>{
            indexProxy: indexProxy,
            selector: null
        });
        this.renderer.call(this.selectorProxy, item, indexProxy, this.selectorProxy);

        this.currentEvent = BindRepeatEvent.INSERT_REINDEXING;
        this.currentIndex++;
        this.updateViewIndexes();

        this.currentEvent = null;
        this.currentIndex = null;
    }

    onRemove(item: T, index: number) {
        this.currentEvent = BindRepeatEvent.REMOVE;
        this.currentIndex = index;

        var itemToRemove = this.repeatItems.splice(index, 1)[0];
        itemToRemove.selector.remove();
        itemToRemove.indexProxy.unsubscribeAll();

        this.currentEvent = BindRepeatEvent.REMOVE_REINDEXING;
        this.updateViewIndexes();

        this.currentEvent = null;
        this.currentIndex = null;
    }

    updateViewIndexes() {
        // I assume that in most use-cases there will be either no index subscribers, or every item will have some
        if (this.indexSubscriberCount > 0) {
            for (; this.currentIndex < this.repeatItems.length; this.currentIndex++) {
                this.repeatItems[this.currentIndex].indexProxy._trigger();
            }
        }
    }

    getCurrentValueOfIndexProxy(indexProxy: BindRepeatIndexProxy) {
        if (this.currentIndex !== null) {
            return this.currentIndex;
        } else {
            var log = console.warn !== undefined ? console.warn : console.log;
            log('WARNING: bindRepeat index queried asynchronously, this can be inefficient');

            for (var i = 0; i < this.repeatItems.length; i++) {
                if (this.repeatItems[i].indexProxy === indexProxy) {
                    return i;
                }
            }
            throw "bindRepeat index not found!";
        }
    }

    getCurrentAndPreviousValueOfIndexProxy(indexProxy: BindRepeatIndexProxy) {
        var newValue = this.getCurrentValueOfIndexProxy(indexProxy);

        var oldValue: number = null;
        if (this.currentEvent === null) {
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


function bindRepeat<T>(modelList: ObservableList<T>, renderer: (modelItem: T, index: number, parent: D3BindSelector) => void): D3BindSelector {
    new BindRepeat<T>(modelList, renderer, this);
    return this;
}
selector.bindRepeat = bindRepeat;
