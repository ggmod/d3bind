import './build';
import d3bind from './root';


if (typeof window !== 'undefined') {
    window.d3bind = d3bind;
}

export default d3bind;


export * from './root';
export * from './selection';
export * from './utils/types';

export {BindingTransition} from './bindings/selection';
export {BindRepeatOptions, BindRepeatRenderer} from './repeat/bind-repeat';

export * from './observable/observable';
export {default as ObservableValue} from './observable/value';
export {default as ObservableView} from './observable/view';
export {default as ObservableProperty} from './observable/property';
export {default as ObservableArray, ObservableArrayHandler} from './observable/array';
export {default as ObservableSet, ObservableSetHandler} from './observable/set';
export {default as ObservableMap, ObservableMapHandler} from './observable/map';

export {default as D3BindGlobalTransition} from './transition/transition';

export * from './scales/scales-interface';
