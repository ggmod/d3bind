import selector, {D3Selector, D3BindSelector} from "../selector";


selector.repeat = function<T>(modelList: ArrayLike<T>, renderer: (modelItem: T, index: number, parent: D3BindSelector) => void): D3BindSelector {
    for (let i = 0; i < modelList.length; i++) {
        renderer.call(this, modelList[i], i, this); // 'this' passed in twice, intentional redundancy
    }
    return this;
};
