import {D3BindSelector} from '../selector';


const UNSUBSCRIBE_PREFIX = '__d3bind_unsubscribe';

export function setUnbindForSelectorField(selector: D3BindSelector, name: string, unsubscribeFunc: () => number) {
    unbindSelectorField(selector, name);

    selector.each(function() {
        bindObjectField(this, name, unsubscribeFunc);
    });
}

export function unbindSelectorField(selector: D3BindSelector, name: string) {
    var unsubscribedCount = 0;
    selector.each(function() {
        unsubscribedCount += unbindObjectField(this, name);
    });
    return unsubscribedCount;
}

export function setUnbindForObjectField(object: any, name: string, unsubscribeFunc: () => number) {
    unbindObjectField(object, name);
    bindObjectField(object, name, unsubscribeFunc);
}

export function unbindObjectField(object: any, name: string): number {
    var unsubscribedCount = 0;
    if (object[UNSUBSCRIBE_PREFIX] && object[UNSUBSCRIBE_PREFIX][name]) {
        unsubscribedCount = object[UNSUBSCRIBE_PREFIX][name]();
        delete object[UNSUBSCRIBE_PREFIX][name];
    }
    return unsubscribedCount;
}

function bindObjectField(object: any, name: string, unsubscribeFunc: () => number) {
    if (!object[UNSUBSCRIBE_PREFIX]) {
        object[UNSUBSCRIBE_PREFIX] = {};
    }
    object[UNSUBSCRIBE_PREFIX][name] = unsubscribeFunc;
}

// unbind all:

export function unbindSelector(selector: D3BindSelector, descendants = false) {
    var unsubscribedCount = 0;
    selector.each(function() {
        unsubscribedCount += descendants ? unbindElementTree(this) : unbindElement(this);
    });
    return unsubscribedCount;
}

function unbindElementTree(root: Node): number {
    var unsubscribedCount = 0;
    unsubscribedCount += unbindElement(root);
    for (var i = 0; i < root.childNodes.length; i++) {
        unsubscribedCount += unbindElementTree(root.childNodes.item(i));
    }
    return unsubscribedCount;
}

function unbindElement(element: Node): number {
    return unbindObject(element);
}

export function unbindObject(object: any): number {
    var unsubscribedCount = 0;
    var unsubscribeFunctions = object[UNSUBSCRIBE_PREFIX];
    if (unsubscribeFunctions) {
        for (var key in unsubscribeFunctions) {
            unsubscribedCount += unsubscribeFunctions[key]();
        }
        for (var key in unsubscribeFunctions) {
            delete unsubscribeFunctions[key];
        }
    }
    return unsubscribedCount;
}
