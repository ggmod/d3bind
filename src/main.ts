/// <reference path="../typings/tsd.d.ts" />
// tsd reference used by browserify, but not used for the npm build

import './build';
import d3bind from './root';

export = d3bind; // export default is not translated to "module.exports=", and browserify requires the latter
