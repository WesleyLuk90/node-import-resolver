'use babel';

import { CompositeDisposable } from 'atom';
import Importer from './Importer';

export default {
    activate() {
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'node-import-resolver:import': () => this.doImport(),
        }));
    },

    doImport() {
        const editor = atom.workspace.getActiveTextEditor();
        Importer.fromTextEditor(editor)
            .doImport()
            .catch((e) => atom.notifications.addError(e.toString()));
    },

    deactivate() {
        this.subscriptions.dispose();
    },
};
