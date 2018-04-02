#!/usr/bin/env node

var fs = require('fs');
var DuplicityCollection = require('./../src/collection');

var config = {};

try
{
    config = JSON.parse(fs.readFileSync('.duplicity.json'));
}
catch (error)
{

}

config.duplicity_command = config.duplicity_command || 'duplicity';
config.env = config.env || {};
config.env['LANG'] = 'en_US.UTF-8';
config.env['PATH'] = process.env['PATH'];

var program = require('commander');

program.version(JSON.parse(fs.readFileSync(__dirname + '/../package.json')).version || 'dev');
//program.option('-f, --format [format]', 'Which type of output format [text/json]?')

var command = program.command('status <url>');
command.description('Get the status of a given collection at an url');
command.action(function(url, options) {
    duplicity=new DuplicityCollection(url, config);
    duplicity.getStatus(function(err, data) {
        if (err)
        {
            console.error(JSON.stringify('ERROR: ', data));
        }
        else
        {
            console.log(JSON.stringify(data));
        }
    });
});

var command = program.command('files <url>');
command.description('List all the files in a specific collection at an url');
command.action(function(url, options) {
    duplicity=new DuplicityCollection(url, config);
    duplicity.getCurrentFiles(function(err, data) {
        if (err)
        {
            console.log(JSON.stringify(data));
        }
        else
        {
            console.log(JSON.stringify(data));
        }
    });
});

var command = program.command('verify <directory> <url>');
command.description('Verify the backup of a directory vs. an url');
command.action(function(directory, url, options) {
    duplicity=new DuplicityCollection(url, config);
    duplicity.verify(directory, function(err, data) {
		console.log(JSON.stringify(data));
		process.exit(err);
    });
});

var command = program.command('full-backup <directory> <url>');
command.description('Create a full backup of a directory to an url');
command.action(function(directory, url, options) {
    duplicity=new DuplicityCollection(url, config);
    duplicity.createFullBackup(directory, function(err, data) {
        if (err)
        {
            console.log(JSON.stringify(data));
        }
        else
        {
            console.log(JSON.stringify(data));
        }
    });
});

var command = program.command('incremental-backup <directory> <url>');
command.description('Create a incremental backup of a directory to an url');
command.action(function(directory, url, options) {
	duplicity=new DuplicityCollection(url, config);
	duplicity.createIncrementalBackup(directory, function(err, data) {
		if (err)
        {
            console.log(JSON.stringify(data));
        }
        else
        {
            console.log(JSON.stringify(data));
        }
	});
});
program.parse(process.argv);
