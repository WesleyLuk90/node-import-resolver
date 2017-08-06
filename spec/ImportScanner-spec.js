'use babel';

import path from 'path';
import ImportScanner from '../lib/ImportScanner';

const folder = path.join(__dirname, 'test-project/some-source.js');

describe('ImportScanner', () => {
    let onComplete;
    let onProgress;

    beforeEach(() => {
        onComplete = jasmine.createSpy('onComplete');
        onProgress = jasmine.createSpy('onProgress');

        this.containsPath = (path) => {
            const matches = onProgress.calls.filter(c => c.args[0].some(i => i.getRelativePath() === path));
            if (matches.length === 0) {
                throw new Error(`Expected calls to conain path ${path} but actual calls were ${JSON.stringify(onProgress.calls.map(c => c.args[0]), null, 4)}`);
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
            this.containsPath('./import1');
            this.containsPath('./nested/import1');
            expect(onProgress.calls[onProgress.calls.length - 1].args).toEqual(onComplete.calls[0].args);
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
                this.containsPath(importPath);
            });
        });
    };

    expectImportFound('ASecondImport', './a-second-import');
    expectImportFound('aSecondImport', './a-second-import');
    expectImportFound('_aSecondImport', './a-second-import');
    expectImportFound('AThirdImport', './AThirdImport');
    expectImportFound('aPackage', 'a-package');

});
