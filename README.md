# Node Import Resolver

Imports a require or import style file from the local project or node modules

## To Use
Highlight a token you want to import and press `ctrl-i` and it will automatically search for a file with a matching name and generate the import statement and insert it at the bottom of the import list. It will autodetect the import style based on whether there are existing import/export or require statements.

## Advanced
You can customize the configuration for part of your project, create a .node-import-resolverrc.yml file and its configuration will apply to all sub folders.
```
# Use this import style instead of detecting one
importStyle: 'require'
# Don't search for imports in any folder with these names (default: [node_modules])
ignoredFolders:
    - node_modules
    - spec
# Start searching for imports in this folder, relative to this configuration file
rootFolder: ../../
```
