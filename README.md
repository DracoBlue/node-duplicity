# node-duplicity (duplicity.js)

**Alpha Hint: This is work in progress.**

This small command line tool is a javascript powered cli wrapper for duplicity. It wraps the output of the python-based
duplicity cli tool into javascript calls and returns json.

Since it's a npm module, it might be integrated into an existing nodejs application.

## Installation

``` console
$ npm install duplicity -g
```

## Cli Usage

Let's say, you want to backup a folder called `myproject` into a local backup at `file://backup`.

Backup myproject to the backup directory:
``` console
$ duplicity.js full-backup myproject file://backup
```

Verify the backup:
``` console
$ duplicity.js verify myproject file://backup
{ newFiles: [ 'hans23', 'hans23/hasn23', 'test2.txt' ],
  deletedFiles: [ 'test.txt' ],
  modifiedFiles: [ '.' ],
  otherDifferences: [] }
```

List all files in the backup:
``` console
$ duplicity.js files file://backup
[ { date: Tue Nov 25 2014 20:14:11 GMT+0100 (CET), file: '.' },
  { date: Tue Nov 25 2014 20:14:11 GMT+0100 (CET),
    file: 'test.txt' } ]
```

Get the backup status of the backup:
``` console
$ duplicity.js status file://backup
[ { type: 'Full',
    date: Mon Dec 01 2014 14:54:49 GMT+0100 (CET),
    volumes: '1' } ]
```

## License

node-duplicity (duplicity.js) is copyright 2014 by DracoBlue and licensed under the terms of MIT License.

