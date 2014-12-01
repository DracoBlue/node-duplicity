# node-duplicity (duplicity.js) [![Build Status](https://secure.travis-ci.org/DracoBlue/node-duplicity.png?branch=master)](https://travis-ci.org/DracoBlue/node-duplicity)

Latest Release: [![GitHub version](https://badge.fury.io/gh/DracoBlue%2Fnode-duplicity.png)](https://github.com/DracoBlue/node-duplicity/releases)

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
{ StartTime: Mon Dec 01 2014 15:46:34 GMT+0100 (CET),
  EndTime: Mon Dec 01 2014 15:46:34 GMT+0100 (CET),
  ElapsedTime: '0.01',
  SourceFiles: '4',
  SourceFileSize: '238',
  NewFiles: '4',
  NewFileSize: '238',
  DeletedFiles: '0',
  ChangedFiles: '0',
  ChangedFileSize: '0',
  ChangedDeltaSize: '0',
  DeltaEntries: '4',
  RawDeltaSize: '0',
  TotalDestinationSizeChange: '254',
  Errors: '0' }
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
[ { date: Mon Dec 01 2014 15:09:46 GMT+0100 (CET), file: '.' },
  { date: Mon Dec 01 2014 15:09:50 GMT+0100 (CET),
    file: 'hans23' },
  { date: Mon Dec 01 2014 15:09:50 GMT+0100 (CET),
    file: 'hans23/hasn23' },
  { date: Mon Dec 01 2014 14:59:53 GMT+0100 (CET),
    file: 'test2.txt' } ]
```

Get the backup status of the backup:
``` console
$ duplicity.js status file://backup
[ { type: 'Full',
    date: Mon Dec 01 2014 15:49:03 GMT+0100 (CET),
    volumes: '1' },
  { type: 'Incremental',
    date: Mon Dec 01 2014 15:49:05 GMT+0100 (CET),
    volumes: '1' } ]
```

## License

node-duplicity (duplicity.js) is copyright 2014 by DracoBlue and licensed under the terms of MIT License.

