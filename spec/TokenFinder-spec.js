'use babel';

import TokenFinder from '../lib/TokenFinder';
import { Point } from 'atom';

describe('TokenFinder', () => {
    let editor;
    beforeEach(() => {
        waitsForPromise(() => atom.workspace.open('node-import-resolver-TokenFinder')
            .then((textEditor) => {
                editor = textEditor;
            }));
    });

    it('should find no tokens', () => {
        const tokenFinder = new TokenFinder(editor);
        expect(tokenFinder.getTokens()).toEqual(null);
    });

    describe('with cursor position', () => {
        beforeEach(() => {
            editor.setText(`some random info
findAToken
more data`);
        });

        it('should find a highlighted token when cursor is in the middle', () => {
            editor.setCursorBufferPosition(new Point(1, 3));
            const tokenFinder = new TokenFinder(editor);
            expect(tokenFinder.getTokens()).toEqual('findAToken');
        });

        it('should find a highlighted token when cursor is at the start', () => {
            editor.setCursorBufferPosition(new Point(1, 0));
            const tokenFinder = new TokenFinder(editor);
            expect(tokenFinder.getTokens()).toEqual('findAToken');
        });

        it('should find a highlighted token when cursor is at the end', () => {
            editor.setCursorBufferPosition(new Point(1, 10));
            const tokenFinder = new TokenFinder(editor);
            expect(tokenFinder.getTokens()).toEqual('findAToken');
        });
    })
});
