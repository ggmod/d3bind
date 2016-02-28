import d3bind from '../root';
import Logger from '../utils/logger';
import {scales, timeScales} from '../scales/scales-wrapper';
import ObservableArray from '../observable/array';
import ObservableMap from '../observable/map';
import ObservableSet from '../observable/set';
import ObservableValue from '../observable/value';
import ObservableView from '../observable/view';


d3bind.ObservableArray = ObservableArray;
d3bind.ObservableMap = ObservableMap;
d3bind.ObservableSet = ObservableSet;
d3bind.ObservableValue = ObservableValue;
d3bind.ObservableView = ObservableView;

d3bind.scale = scales;
d3bind.time = { scale: timeScales };

Object.defineProperty(d3bind, 'logging', {
    get: () => Logger.enabled,
    set: (value) => Logger.enabled = value
});
