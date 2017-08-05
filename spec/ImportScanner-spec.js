'use babel';

import path from 'path';
import ImportScanner from '../lib/ImportScanner';

const folder = path.join(__dirname, 'test-project');

describe('ImportScanner', () => {
    let onComplete;
    let onProgress;

    beforeEach(() => {
        onComplete = jasmine.createSpy('onComplete');
        onProgress = jasmine.createSpy('onProgress');

        this.containsPath = (path) => {
            const matches = onProgress.calls.filter(c => c.args[0].indexOf(path) > -1);
            if (matches.length === 0) {
                throw new Error(`Expected calls to conain path ${path} but actual calls were ${JSON.stringify(onProgress.calls, null, 4)}`);
            }
        };
    });

    it('should scan for imports', () => {
        const importScanner = ImportScanner.create(folder, 'import1', onProgress);
        importScanner.start(onProgress, onComplete)
            .then(onComplete);

        waitsFor(() => {
            return onComplete.calls.length > 0;
        });

        runs(() => {
            expect(onProgress.calls.length).toBe(2);
            this.containsPath(path.join(__dirname, 'test-project/import1.js'));
            this.containsPath(path.join(__dirname, 'test-project/nested/import1.js'));
        });
    });

    const expectImportFound = (token, importPath) => {
        it(`it should find ${token} as ${importPath}`, () => {
            const importScanner = ImportScanner.create(folder, token, onProgress);
            importScanner.start(onProgress, onComplete)
                .then(onComplete);

            waitsFor(() => {
                return onComplete.calls.length > 0;
            });

            runs(() => {
                expect(onProgress.calls.length).toBe(1);
                this.containsPath(importPath);
            });
        });
    };

    expectImportFound('ASecondImport', path.join(__dirname, 'test-project/a-second-import.js'));
    expectImportFound('aSecondImport', path.join(__dirname, 'test-project/a-second-import.js'));
    expectImportFound('_aSecondImport', path.join(__dirname, 'test-project/a-second-import.js'));
    expectImportFound('AThirdImport', path.join(__dirname, 'test-project/AThirdImport.jsx'));

});
