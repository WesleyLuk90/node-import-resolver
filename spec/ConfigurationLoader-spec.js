'use babel';
import ConfigurationLoader from '../lib/ConfigurationLoader';
import path from 'path';
import Configuration from '../lib/Configuration';

describe('ConfigurationLoader', () => {
    it('should load configuration', () => {
        const loader = ConfigurationLoader.fromFilePath(path.join(__dirname, 'test-project/require/something/somejsfile.js'));

        waitsForPromise(() => loader.load()
            .then((config) => {
                expect(config instanceof Configuration).toBe(true);
                expect(config.getImportStyle()).toBe('require');
                expect(config.getIgnoredFolders()).toEqual(['node_modules', 'spec']);
            }));
    });
});
