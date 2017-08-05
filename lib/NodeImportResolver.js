'use babel';

import { CompositeDisposable } from 'atom';

export default {
    activate() {
        console.log('activate');
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'node-import-resolver:import': () => this.doImport(),
        }));
    },

    doImport() {
        console.log("running import");
        console.log(atom.workspace.getActiveTextEditor());
        console.log(new atom.TextEditor());
    },

    deactivate() {
        console.log('deactivate');
        this.subscriptions.dispose();
    },
}
