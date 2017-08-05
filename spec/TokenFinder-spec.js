'use babel';

import TokenFinder from '../lib/TokenFinder';
import { Point, Range } from 'atom';

describe('TokenFinder', () => {
    let editor;
    beforeEach(() => {
        waitsForPromise(() => atom.workspace.open('node-import-resolver-TokenFinder')
            .then((textEditor) => {
                editor = textEditor;
            }));
    });

    it('should find no tokens', () => {
        const finder = new TokenFinder(editor);
        expect(finder.getToken()).toEqual(null);
    });

    describe('with cursor position', () => {
        beforeEach(() => {
            editor.setText(`some random info
findAToken
more data`);
        });

        it('should find a highlighted token when cursor is in the middle', () => {
            editor.setCursorBufferPosition(new Point(1, 3));
            const finder = new TokenFinder(editor);
            expect(finder.getToken()).toEqual('findAToken');
        });

        it('should find a highlighted token when cursor is at the start', () => {
            editor.setCursorBufferPosition(new Point(1, 0));
            const finder = new TokenFinder(editor);
            expect(finder.getToken()).toEqual('findAToken');
        });

        it('should find a highlighted token when cursor is at the end', () => {
            editor.setCursorBufferPosition(new Point(1, 10));
            const finder = new TokenFinder(editor);
            expect(finder.getToken()).toEqual('findAToken');
        });
    });

    describe('with selection', () => {
        beforeEach(() => {
            editor.setText(`some random info
@#$% findAToken !@#$
more data`);
        });

        it('should not find an invalid token', () => {
            editor.setSelectedBufferRange(new Range(new Point(1, 1), new Point(1, 3)));
            const finder = new TokenFinder(editor);
            expect(finder.getToken()).toBe(null);
        });

        it('should find an exactly selected token', () => {
            editor.setSelectedBufferRange(new Range(new Point(1, 6), new Point(1, 15)));
            const finder = new TokenFinder(editor);
            expect(finder.getToken()).toBe("findAToken");
        });

        it('should find a partially selected token', () => {
            editor.setSelectedBufferRange(new Range(new Point(1, 8), new Point(1, 10)));
            const finder = new TokenFinder(editor);
            expect(finder.getToken()).toBe("findAToken");
        });

        it('should find a exactly token at the start of a selection', () => {
            editor.setSelectedBufferRange(new Range(new Point(1, 6), new Point(1, 20)));
            const finder = new TokenFinder(editor);
            expect(finder.getToken()).toBe("findAToken");
        });

        it('should fail to find a token not at the start', () => {
            editor.setSelectedBufferRange(new Range(new Point(1, 0), new Point(1, 15)));
            const finder = new TokenFinder(editor);
            expect(finder.getToken()).toBe(null);
        });
    });
});
