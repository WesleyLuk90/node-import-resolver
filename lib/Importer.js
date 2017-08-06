'use babel';

import TokenFinder from './TokenFinder';
import ImportScanner from './ImportScanner';
import ImportSelectView from './ImportSelectView';
import ImportStyleHeuristic from './ImportStyleHeuristic';
import ImportLocationSearcher from './ImportLocationSearcher';
import ConfigurationLoader from './ConfigurationLoader';

export default class Importer {
    static fromTextEditor(textEditor) {
        return new Importer(textEditor);
    }

    constructor(textEditor) {
        Object.assign(this, { textEditor });
    }

    getFile() {
        return this.textEditor.getPath();
    }

    doImport() {
        const token = new TokenFinder(this.textEditor).getToken();
        if (!token) {
            console.log('no token found');
            return Promise.resolve();
        }
        return ConfigurationLoader.fromFilePath(this.getFile()).load()
            .then((config) => {
                return this.showModal(token, config)
                    .then((item) => this.insertImport(item, config));
            })
            .catch((e) => {
                if (e.message !== 'No Option Selected') {
                    throw e;
                }
            });
    }

    showModal(token, config) {
        const view = new ImportSelectView();
        return Promise.race([
            ImportScanner.create(this.getFile(), token, (p) => {
                view.setItems(p);
            }, config)
            .start()
            .then((p) =>
                new Promise((resolve) => {
                    if (p.length === 1) {
                        resolve(p[0]);
                    }
                })
            ),
            view.getPromise(),
        ]).then((value) => {
            view.cancel();
            return value;
        });
    }

    insertImport(item, config) {
        const style = ImportStyleHeuristic.fromSource(this.textEditor.getText(), config).getStyle();
        const location = ImportLocationSearcher.fromSource(this.textEditor.getText()).getLocation();
        const importLine = item.format(style);
        this.insert(importLine, location);
    }

    insert(text, location) {
        this.textEditor.getBuffer().insert(location, text + '\n');
    }
}
