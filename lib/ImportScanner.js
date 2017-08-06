'use babel';

import fs from 'fs';
import bluebird from 'bluebird';
import path from 'path';

const readdir = bluebird.promisify(fs.readdir);
const stat = bluebird.promisify(fs.stat);

export default class ImportScanner {
    static create(rootFolder, token, onProgress) {
        return new ImportScanner(rootFolder, token, onProgress);
    }

    constructor(rootFolder, token, onProgress) {
        Object.assign(this, { rootFolder, token, onProgress });
        this.files = [];
    }

    start() {
        return this.scanDir(this.rootFolder)
            .then(() => this.files);
    }

    foundFile(file) {
        this.files.push(file);
        this.onProgress(this.files);
    }

    checkFile(file) {
        const ext = path.extname(file);
        const basename = path.basename(file, ext);
        if (this.matchesTokenName(basename) && this.matchesExtension(ext)) {
            this.foundFile(file);
        }
    }

    matchesTokenName(name) {
        return this.normalizeTokenName(name) === this.normalizeTokenName(this.token);
    }

    matchesExtension(ext) {
        return ['.js', '.jsx'].indexOf(ext) > -1;
    }

    normalizeTokenName(token) {
        return token.replace(/[^a-z0-9]/gi, '').toLowerCase();
    }

    processNode(absPath) {
        return stat(absPath)
            .then((stat) => {
                if (stat.isFile()) {
                    return this.checkFile(absPath);
                } else if (stat.isDirectory()) {
                    return this.scanDir(absPath);
                }
            });
    }

    scanDir(dir) {
        return readdir(dir)
            .then((files) =>
                bluebird.mapSeries(files,
                    (file) => this.processNode(path.join(dir, file))));
    }
}
