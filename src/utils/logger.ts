
const INDENT_SIZE = 2;

export default class Logger {

    constructor(private type: string, private name?: string) { }

    logIndent(...params: any[]) {
        if (Logger._enabled) {
            this._log(...params);
            Logger._depth += INDENT_SIZE;
        }
    }

    logUnindent(...params: any[]) {
        if (Logger._enabled) {
            if (params.length > 0) {
                this._log(...params);
            }
            Logger._depth -= INDENT_SIZE;
        }
    }

    log<T>(...params: any[]) {
        if (Logger._enabled) {
            this._log(...params);
        }
    }

    _log<T>(...params: any[]) {
        var prefix = (Logger._depth === 0 ? '\n' : '') + new Array(Logger._depth + 1).join(' ') +
            this.type + (this.name ? '(' + this.name + ')' : '') + ': ';
        console.log(prefix, ...params);
    }

    private static _depth = 0;
    private static _enabled = false;

    static get enabled() {
        return this._enabled;
    }

    static set enabled(value) {
        this._enabled = value;
        this._depth = 0;
    }

    static get(type: string, name?: string) {
        return new Logger(type, name);
    }
}
