'use babel';

import path from 'path';
import RootFolderWalker from '../lib/RootFolderWalker';

describe('RootFolderWalker', () => {
    it('should find the root folder', () => {
        const walker = RootFolderWalker.fromFile(path.join(__dirname, 'test-project/nested/non-exist/file.js'));
        const expectedPath = path.join(__dirname, 'test-project');

        waitsForPromise(() => walker.getRootFolder()
            .then((folder) => expect(folder).toEqual(expectedPath)));
    });

    it('should return the default on failure', () => {
        const walker = RootFolderWalker.fromFile('/path-that-does-not-exist/a/b/c/d');
        const expectedPath = path.dirname(__dirname);

        spyOn(atom.project, 'getPaths').andReturn([path.dirname(__dirname)]);

        waitsForPromise(() => walker.getRootFolder()
            .then((folder) => expect(folder).toEqual(expectedPath)));
    });
});
