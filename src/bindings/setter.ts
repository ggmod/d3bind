import {subscribe, getSubscribedValue} from '../observable/helpers';
import ObservableProxy from '../observable/proxy';
import {unbindObjectField, setUnbindForObjectField} from './unbind';


export function addObservableSetter(source: any, object: any, name: string) {

    var sourceFunc = source[name];
    var observable = new ObservableProxy(() => sourceFunc(), value => sourceFunc(value), name);
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

        override(getSubscribedValue<any>(observable, converter));

        var unsubscribeFunc = subscribe(observable, () => {
            override(getSubscribedValue<any>(observable, converter));
        });

        setUnbindForObjectField(object, name, unsubscribeFunc);

        return object;
    };

    object['unbind' + bindName] = () => {
        unbindObjectField(object, name);
        return object;
    };
}
