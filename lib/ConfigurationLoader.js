'use babel';
import Configuration from './Configuration';
import bluebird from 'bluebird';
import path from 'path';
import jsYaml from 'js-yaml';
import fs from 'fs';
import assert from 'assert';

const readFile = bluebird.promisify(fs.readFile);
const stat = bluebird.promisify(fs.stat);

export default class ConfigurationLoader {
    static fromFilePath(filePath) {
        assert(filePath);
        return new ConfigurationLoader(filePath);
    }

    constructor(filePath) {
        Object.assign(this, { filePath });
    }

    findConfig(folderPath) {
        const configPath = path.join(folderPath, '.node-import-resolverrc.yml');
        return stat(configPath)
            .then((stat) => {
                if (stat.isFile()) {
                    return configPath;
                }
                throw new Error('Not a file');
            })
            .catch((e) => {
                if (this.shouldContinue(folderPath)) {
                    return this.findConfig(path.dirname(folderPath));
                }
                throw e;
            });
    }

    shouldContinue(folderPath) {
        return folderPath != null && path.dirname(folderPath) !== folderPath;
    }

    loadConfig(path) {
        return readFile(path, 'utf-8')
            .then((contents) => {
                const configData = jsYaml.safeLoad(contents);
                return Configuration.createDefault()
                    .setImportStyle(configData.importStyle);
            });
    }

    load() {
        return this.findConfig(this.filePath)
            .then(path => this.loadConfig(path))
            .catch(() => Configuration.createDefault())
    }
}
