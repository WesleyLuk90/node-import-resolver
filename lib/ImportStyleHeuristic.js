'use babel';

export default class ImportStyleHeuristic {
    static fromSource(source) {
        return new ImportStyleHeuristic(source);
    }

    constructor(source) {
        Object.assign(this, { source });
    }

    countRequires() {
        return this.regexCount(/(var|let|const)\s+[a-z0-9_$]+\s+=\s+require\(.*\)/gi);
    }

    countImports() {
        return this.regexCount(/import\s+[a-z0-9_$]+\s+from\s+.*?/gi) +
            this.regexCount(/import\s+\{(\s*[a-z0-9_$]+\s*,?\s*)+\}\s+from\s+.*?/gi) +
            this.regexCount(/(^|\n)\s*export default /gi) +
            this.regexCount(/(^|\n)\s*export /gi);
    }

    regexCount(regex) {
        let count = 0;
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
