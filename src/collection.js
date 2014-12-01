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
		cb(error, stdout, stderr);
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
        if (code)
        {
            cb(code, stdout + "\n" + stderr);
            return ;
        }
        else
        {
            cb(code, stdout)
        }
    });
};

DuplicityCollection.prototype.createFullBackup = function (directory, cb) {
    this.rawCall(['full', directory, this.url], function (code, stdout, stderr) {
        if (code)
        {
            cb(code, stdout + "\n" + stderr);
            return ;
        }
        else
        {
            cb(code, stdout)
        }
    });
};
