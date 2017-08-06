'use babel';

import path from 'path';
import PackageScanner from '../lib/PackageScanner';

describe('PackageScanner', () => {
    it('should scan package.json', () => {
        const scanner = PackageScanner.fromFilePath(path.join(__dirname, 'test-project'));

        waitsForPromise(() => {
            return scanner.getPackageList()
                .then((packageList) => {
                    expect(packageList).toEqual(['a-package', 'b-package']);
                });
        });
    });
});
