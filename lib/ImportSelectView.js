'use babel';
import { SelectListView } from 'atom-space-pen-views';

export default class ImportSelectView extends SelectListView {
    constructor() {
        super();
        this.storeFocusedElement();
        this.setItems([]);
        this.panel = atom.workspace.addModalPanel({ item: this });
        this.panel.show();
        this.focusFilterEditor();
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    getPromise() {
        return this.promise;
    }

    confirmed(item) {
        this.resolve(item);
        this.cancelled();
        this.restoreFocus();
    }

    viewForItem(item) {
        return `<li>
            <div class="file icon icon-file-text" data-name="${item.getImportName()}" data-path="${item.getRelativePath()}">${item.getRelativePath()}</div>
        </li>`;
    }

    cancelled() {
        this.reject(new Error('No Option Selected'));
        this.panel.destroy();
    }
}
