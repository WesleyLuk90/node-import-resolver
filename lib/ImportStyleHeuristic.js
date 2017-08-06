'use babel';

import ImportMatchers from './ImportMatchers';
import assert from 'assert';

export default class ImportStyleHeuristic {
    static fromSource(source) {
        return new ImportStyleHeuristic(source);
    }

    constructor(source) {
        Object.assign(this, { source });
    }

    countRequires() {
        return this.regexSum(ImportMatchers.getRequireMatchers());
    }

    countImports() {
        return this.regexSum(ImportMatchers.getImportStyleMatchers());
    }

    regexSum(regexes) {
        return regexes.reduce((sum, regex) => sum + this.regexCount(regex), 0);
    }

    regexCount(regex) {
        let count = 0;
        assert(regex.flags.indexOf('g') > -1);
        while (regex.exec(this.source)) {
            count++;
        }
        return count;
    }

    getStyle() {
        const requires = this.countRequires();
        const imports = this.countImports();
        if (requires > imports) {
            return 'require';
        }
        return 'import';
    }
}
