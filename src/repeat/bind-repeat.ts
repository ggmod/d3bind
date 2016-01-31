import selector, {D3Selector, D3BindSelector} from "../selector";
import ObservableList from "../observable/list";

function insertRepeatItem(input: string, i: number, parent: D3BindSelector, repeatItems: D3BindSelector[]): D3BindSelector;
function insertRepeatItem(input: () => EventTarget, i: number, parent: D3BindSelector, repeatItems: D3BindSelector[]): D3BindSelector;
function insertRepeatItem(input: any, i: number, parent: D3BindSelector, repeatItems: D3BindSelector[]): D3BindSelector {
    var newItem: D3BindSelector = null;
    if (i >= repeatItems.length) {
        newItem = parent.append(input);
    } else {
        /* I wanted to use something like '> :nth-child($i+1)', but querySelector and thus d3 .insert() doesn't support
         selectors for direct children only, except with polyfills:
         http://stackoverflow.com/questions/6481612/queryselector-search-immediate-children */
        newItem = parent.insert(input, () => parent.node().childNodes[i]);
    }
    repeatItems.splice(i, 0, newItem);
    return newItem;
}

function parentProxy(parent: D3BindSelector, i: number, repeatItems: D3BindSelector[]): D3BindSelector {
    var proxy: D3BindSelector = Object.create(parent);
    proxy.append = function(input: any): D3BindSelector {
        return insertRepeatItem(input, i, parent, repeatItems);
    };
    proxy.insert = function(input: any, before: any): D3BindSelector {
        if (before !== undefined) throw "before parameter of .insert() not supported inside bindRepeat";
        return insertRepeatItem(input, i, parent, repeatItems);
    };
    return proxy;
}

 function bindRepeat<T>(modelList: ObservableList<T>, renderer: (modelItem: T, index: number, parent: D3BindSelector) => void): D3BindSelector {

    var repeatItems: D3BindSelector[] = [];

    for (let i = 0; i < modelList.length; i++) {
        var proxy = parentProxy(this, i, repeatItems);
        renderer.call(proxy, modelList.get(i), i, proxy); // 'this' passed in twice, intentional redundancy
    }

    modelList.subscribe({
        insert: (item, index) => {
            var proxy = parentProxy(this, index, repeatItems);
            renderer.call(proxy, item, index, proxy);
        },
        remove: (item, index) => {
            var itemToRemove = repeatItems.splice(index, 1)[0];
            itemToRemove.remove();
        }
    });

    return this;
}
selector.bindRepeat = bindRepeat;
