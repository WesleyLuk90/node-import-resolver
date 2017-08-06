'use babel';

import path from 'path';
import TokenFinder from './TokenFinder';
import ImportScanner from './ImportScanner';
import ImportSelectView from './ImportSelectView';
import ImportFormatter from './ImportFormatter';
import ImportStyleHeuristic from './ImportStyleHeuristic';
import ImportLocationSearcher from './ImportLocationSearcher';
import { Range } from 'atom';

export default class Importer {
    static fromTextEditor(textEditor) {
        return new Importer(textEditor);
    }

    constructor(textEditor) {
        Object.assign(this, { textEditor });
    }

    getFolder() {
        return path.dirname(this.textEditor.getPath());
    }

    getFile() {
        return this.textEditor.getPath();
    }

    doImport() {
        const token = new TokenFinder(this.textEditor).getToken();
        if (!token) {
            console.log('no token found');
            return;
        }
        return this.showModal(token)
            .then((item) => this.insertImport(item));
    }

    showModal(token) {
        const view = new ImportSelectView();
        const formatter = new ImportFormatter(this.getFile(), token);
        return Promise.race([
            ImportScanner.create(path.dirname(this.getFolder()), token, (p) => {
                view.setItems(formatter.format(p));
            })
            .start()
            .then((p) =>
                new Promise((resolve) => {
                    if (p.length === 1) {
                        resolve(formatter.format(p)[0]);
                    }
                })
            ),
            view.getPromise(),
        ]).then((value) => {
            view.cancelled();
            return value;
        });
    }

    insertImport(item) {
        const style = ImportStyleHeuristic.fromSource(this.textEditor.getText()).getStyle();
        const location = ImportLocationSearcher.fromSource(this.textEditor.getText()).getLocation();
        const importLine = item.format(style);
        this.insert(importLine, location);
    }

    insert(text, location) {
        const originalSelection = this.textEditor.getSelectedBufferRanges();
        const newRange = new Range(location, location);
        this.textEditor.setSelectedBufferRange(newRange);
        this.textEditor.insertText(text);
        this.textEditor.insertNewline();
        this.textEditor.setSelectedBufferRanges(originalSelection);
    }
}
