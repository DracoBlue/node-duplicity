module.exports = DuplicityCollection = function (url, options) {
    this.url = url;
    this.options = options || {};
};

DuplicityCollection.prototype.rawCall = function (parameters, cb) {
    var that = this;
	var exec = require('child_process').exec;

//	parameters.push('-v9');
//    parameters.push('--no-encryption')
//    parameters.push('--use-agent');
//	console.log(this.options);
//	console.log('exec: ', this.options.duplicity_command + ' ' + parameters.join(' '));
	exec('bash -l -c \'' + this.options.duplicity_command + ' ' + parameters.join(' ') + '\'', {
		"env": this.options.env
	},function(error, stdout, stderr)
	{
		cb(error !== null ? error.code : false, stdout, stderr);
	});
};

DuplicityCollection.prototype.getStatus = function (cb) {
    this.rawCall(['collection-status', this.url], function (code, stdout, stderr) {
        if (code)
        {
            cb(code, stdout + "\n" + stderr);
            return ;
        }

        var matchesMultiRegExp = /^\s+(Full|Incremental)\s+([\w\d]+\s+[\w\d]+\s+[\d]+\s+[\d]+\:[\d]+\:[\d]+\s+[\d]+)\s+([\d]+)$/mg;
        var matchesLineRegExp = /^\s+(Full|Incremental)\s+([\w\d]+\s+[\w\d]+\s+[\d]+\s+[\d]+\:[\d]+\:[\d]+\s+[\d]+)\s+([\d]+)$/;

        var matches = stdout.match(matchesMultiRegExp);

        if (!matches) {
            cb(true, 'Cannot find collection status info!');
        }
        else {
            var backups = [];
            matches.forEach(function (match) {
                var parts = match.match(matchesLineRegExp);
                if (parts) {
                    backups.push({
                        "type": parts[1],
                        "date": new Date(parts[2]),
                        "volumes": parts[3]
                    });
                }
            });
            cb(false, backups);
        }
    });
};

DuplicityCollection.prototype.getCurrentFiles = function (cb) {
    this.rawCall(['list-current-files', this.url], function (code, stdout, stderr) {
        if (code)
        {
            cb(code, stdout + "\n" + stderr);
            return ;
        }

        var matchesMultiRegExp = /^([\w\d]+\s+[\w\d]+\s+[\d]+\s+[\d]+\:[\d]+\:[\d]+\s+[\d]+)\s+(.+)$/mg;
        var matchesLineRegExp = /^([\w\d]+\s+[\w\d]+\s+[\d]+\s+[\d]+\:[\d]+\:[\d]+\s+[\d]+)\s+(.+)$/;

        var matches = stdout.match(matchesMultiRegExp);

        if (!matches) {
            cb(true, 'Cannot find files in this collection');
        }
        else {
            var files = [];
            matches.forEach(function (match) {
                var parts = match.match(matchesLineRegExp);
                if (parts) {
                    files.push({
                        "date": new Date(parts[1]),
                        "file": parts[2]
                    });
                }
            });
            cb(false, files);
        }
    });
};

DuplicityCollection.prototype.verify = function (directory, cb) {
    this.rawCall(['verify', this.url, directory], function (code, stdout, stderr) {
//        if (code)
//        {
//			console.log('code', code);
//            cb(code, stdout + "\n" + stderr);
//            return ;
//        }
//        else
//        {
		var matchesMultiRegExp = /^Difference found\: (.+)$/mg;
		var matchesNewFileRegExp = /^Difference found\: New file (.+)$/;
		var matchesDeletedFileRegExp = /^Difference found\: File (.+) is missing$/;
		var matchesModifiedFileRegExp = /^Difference found\: File (.+) has mtime (.+), expected (.+)$/;

		var matches = stdout.match(matchesMultiRegExp);
			var differences = {
				"newFiles": [],
				"deletedFiles": [],
				"modifiedFiles": [],
				"otherDifferences": []
			};
		if (matches)
		{
			matches.forEach(function (lineMatch) {
				var newFileMatch = lineMatch.match(matchesNewFileRegExp);
				if (newFileMatch)
				{
					differences["newFiles"].push(newFileMatch[1]);
					return ;
				}

				var deletedFileMatch = lineMatch.match(matchesDeletedFileRegExp);
				if (deletedFileMatch)
				{
					differences["deletedFiles"].push(deletedFileMatch[1]);
					return ;
				}

				var modifiedFileMatch = lineMatch.match(matchesModifiedFileRegExp);
				if (modifiedFileMatch)
				{
					differences["modifiedFiles"].push(modifiedFileMatch[1]);
					return ;
				}

				differences["other"].push(lineMatch.substr('Difference found: '.length));
			});
		};
			cb(code, differences);
//			cb(code, stdout)
//        }
    });
};

DuplicityCollection.prototype.createBackup = function (directory, type, cb) {
    this.rawCall([type, directory, this.url], function (code, stdout, stderr) {
        if (code)
        {
            cb(code, stdout + "\n" + stderr);
            return ;
        }
        else
        {
			var hasBackupStatistics = stdout.indexOf('[ Backup Statistics ]') !== -1 ? true : false;

			if (hasBackupStatistics)
			{
				/* We only want the backupstatistics*/
				var stdoutBackupStatistics = stdout.substr(stdout.indexOf('[ Backup Statistics ]') + '[ Backup Statistics ]'.length);
				/* ... they are finished with ----- at the end */
				stdoutBackupStatistics = stdoutBackupStatistics.substr(0, stdout.indexOf('-------------------------'));

				var matchesMultiRegExp = /^([^ \s]+) (.+)$/gm;
				var keyValueDateRegExp = /^([^ \s]+) ([^ ]+) \(([^)]+ [^)]+ [^)]+ [^)]+ [^)]+)\)$/;
				var keyValueRegexp = /^([^ \s]+) ([^ ]+).*$/;
				var matches = stdoutBackupStatistics.match(matchesMultiRegExp);

				var statistics = {};

				if (matches)
				{
					matches.forEach(function (lineMatch) {
						var keyValueDateMatch = lineMatch.match(keyValueDateRegExp);

						if (keyValueDateMatch)
						{
							statistics[keyValueDateMatch[1]] = new Date(keyValueDateMatch[3]);
							return ;
						}

						var keyValueMatch = lineMatch.match(keyValueRegexp);
						if (keyValueMatch)
						{
							try
							{
								statistics[keyValueMatch[1]] = parseFloat(keyValueMatch[2]);
							}
							catch (error)
							{
								statistics[keyValueMatch[1]] = keyValueMatch[2];
							}
							return ;
						}
					});
				}
				cb(code, statistics);
			}
			else
			{
				cb(1, {"message": "Stdout did not contain Backup Statistics!" });
			}
        }
    });
};

DuplicityCollection.prototype.createFullBackup = function (directory, cb) {
	this.createBackup(directory, 'full', cb);
};


DuplicityCollection.prototype.createIncrementalBackup = function (directory, cb) {
	this.createBackup(directory, 'incremental', cb);
};

