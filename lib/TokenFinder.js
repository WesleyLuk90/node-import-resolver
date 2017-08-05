'use babel';

import { TextEditor, Point, Range } from 'atom';
import assert from 'assert';

const tokenMatcher = /[a-z_\$]/i;
const maxScan = 100;

export default class TokenFinder {
    constructor(textEditor) {
        assert(textEditor instanceof TextEditor);
        this.textEditor = textEditor;
    }

    getToken() {
        const cursor = this.getEffectiveSearchPosition();
        const token = this.scanReverse(cursor) + this.scanForward(cursor);
        if (this.isEmpty(token)) {
            return null
        }
        return token;
    }

    getEffectiveSearchPosition() {
        const selection = this.textEditor.getSelectedBufferRange();
        if (selection.start.isEqual(selection.end)) {
            return this.textEditor.getCursorBufferPosition();
        }
        return selection.start;
    }

    isEmpty(token) {
        return token.length === 0;
    }

    scanForward(startCursor) {
        return this.scan(startCursor, c => this.nextCursor(c), (o, c) => o + c);
    }

    nextCursor(cursor) {
        return new Point(cursor.row, cursor.column + 1);
    }

    scanReverse(startCursor) {
        return this.scan(startCursor, c => this.previousCursor(c), (o, c) => c + o);
    }

    previousCursor(cursor) {
        return new Point(cursor.row, cursor.column - 1);
    }

    scan(initialCursor, cursorNextFunction, appendFunction) {
        let thisCursor = initialCursor;
        let nextCursor = cursorNextFunction(thisCursor);
        let output = "";
        for (let i = 0; i < 100; i++) {
            const character = this.textEditor.getTextInBufferRange(new Range(thisCursor, nextCursor));
            if (!character.match(tokenMatcher)) {
                return output;
            }
            output = appendFunction(output, character);
            thisCursor = nextCursor;
            nextCursor = cursorNextFunction(thisCursor);
        }
        throw new Error(`Scanned ${maxScan} characters but could not find the end of the token`);
    }
}
