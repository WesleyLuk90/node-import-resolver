'use babel';

import ImportStyleHeuristic from '../lib/ImportStyleHeuristic';

describe('ImportStyleHeuristic', () => {
    function expectStyle(source, style) {
        it(`should return ${style} for ${source}`, () => {
            const heuristic = ImportStyleHeuristic.fromSource(source);
            expect(heuristic.getStyle()).toBe(style);
        });
    }

    expectStyle('', 'import');
    expectStyle(`import a from 'b';`, 'import');
    expectStyle(`import a from 'b';\nimport c from 'd';\nvar k = require('k');`, 'import');
    expectStyle(`export default class a {}
var b = require('a')`, 'import');
    expectStyle(`import {a} from 'k'
var b = require('a')`, 'import');
    expectStyle(`import {a,b ,c} from 'k'
var b = require('a')`, 'import');
    expectStyle(`var b = require('a')
export function b(){}`, 'import');
    expectStyle(`var b = require('a')
    export function b(){}`, 'import');
    expectStyle(`var b = require('a')
\texport function b(){}`, 'import');

    expectStyle(`let a = require('a');`, 'require');
    expectStyle(`require('a');`, 'require');
    expectStyle(`var a = require('../../some/strange/pa$$th.abc');`, 'require');
    expectStyle(`const a_234$ = require('a');`, 'require');
    expectStyle(`const a = require('a')`, 'require');
    expectStyle(`const $ = require('jQuery')`, 'require');
    expectStyle(`function() {
const c = require('c');
}`, 'require');
});
