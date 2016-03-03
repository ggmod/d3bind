import {Noop} from "../utils/types";
import d3bind from '../root';


const TRANSITION_PREFIX = 'd3bind_global_';
var sequence = 0;

export default class D3BindTransition {

    /*private*/ constructor() {}

    private _id = sequence++;

    private _delay: number;
    private _duration: number;
    private _ease: (t: number) => number;

    private _eventHandlers: { [type: string]: Noop[] } = {
        start: [],
        end: [],
        interrupt: []
    };

    delay(): number;
    delay(delay: number): this;
    delay(delay?: number): any {
        if (delay !== undefined) {
            this._delay = delay;
            return this;
        } else {
            return this._delay;
        }
    }

    duration(): number;
    duration(duration: number): this;
    duration(duration?: number): any {
        if (duration !== undefined) {
            this._duration = duration;
            return this;
        } else {
            return this._duration;
        }
    }

    ease(): (t: number) => number;
    ease(value: (t: number) => number): this;
    ease(value?: (t: number) => number): any {
        if (value !== undefined) {
            this._ease = value;
            return this;
        } else {
            return this._ease;
        }
    }

    run(listener: (t: number) => void): void {
        var t = d3.select(document).transition(TRANSITION_PREFIX + this._id);

        if (this._delay !== undefined) {
            t.delay(this._delay);
        }
        if (this._duration !== undefined) {
            t.duration(this._duration);
        }
        if (this._ease !== undefined) {
            t.ease(this._ease);
        }

        ['start', 'end', 'interrupt'].forEach(type => {
            if (this._eventHandlers[type].length > 0) {
                t.each(type, () => {
                    this._eventHandlers[type].forEach(handler => { handler.call(null); });
                });
            }
        });

        t.tween(TRANSITION_PREFIX + this._id, () => listener);
    }

    on(type: string, eventHandler: Noop): this {
        this._eventHandlers[type].push(eventHandler);
        return this;
    }
}

d3bind.transition = function() {
    return new D3BindTransition();
};
