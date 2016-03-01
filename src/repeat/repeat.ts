import selection, {D3Selection, D3BindSelection} from "../selection";


selection.repeat = function<T>(modelList: ArrayLike<T>, renderer: (modelItem: T, index: number, parent: D3BindSelection) => void): D3BindSelection {
    for (let i = 0; i < modelList.length; i++) {
        renderer.call(this, modelList[i], i, this); // 'this' passed in twice, intentional redundancy
    }
    return this;
};
