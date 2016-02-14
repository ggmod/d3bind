import {bind} from './helpers';
import ObservableProxy from '../observable/proxy';


export function addObservableSetter(source: any, object: any, name: string) {

    var sourceFunc = source[name];
    var observable = new ObservableProxy(() => sourceFunc(), value => sourceFunc(value));
    var override = (value?: any) => {
        if (value !== undefined) {
            observable.set(value);
            return object;
        } else {
            return sourceFunc();
        }
    };

    object[name] = override;
    object['$' + name] = observable;

    var bindName = name.charAt(0).toUpperCase() + name.substr(1);
    object['bind' + bindName] = (observable: any, converter?: any) => {
        bind(observable, converter, (value) => {
            override(value);
        });
        return object;
    };
}
