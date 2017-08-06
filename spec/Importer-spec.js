'use babel';
import path from 'path';
import Importer from '../lib/Importer';
import { Point } from 'atom';

describe('Importer', () => {
    let editor;
    beforeEach(() => {
        waitsForPromise(() => atom.workspace.open(path.join(__dirname, 'test-project/something.js'))
            .then((textEditor) => {
                editor = textEditor;
            }));
    });

    afterEach(() => editor.destroy());

    it('should import', () => {
        editor.setText(`'use strict';
import a from 'b';

ASecondImport

function(){};`);
        editor.setCursorBufferPosition(new Point(3, 3));
        waitsForPromise(() => Importer.fromTextEditor(editor).doImport());

        runs(() => {
            expect(editor.getText()).toBe(`'use strict';
import a from 'b';
import ASecondImport from './a-second-import';

ASecondImport

function(){};`);
        });
    });

    it('should import a module', () => {
        editor.setText(`'use strict';
import a from 'b';

aPackage

function(){};`);
        editor.setCursorBufferPosition(new Point(3, 3));
        waitsForPromise(() => Importer.fromTextEditor(editor).doImport());

        runs(() => {
            expect(editor.getText()).toBe(`'use strict';
import a from 'b';
import aPackage from 'a-package';

aPackage

function(){};`);
        });
    });
});
