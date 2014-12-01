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

var program = require('commander');

program.version(JSON.parse(fs.readFileSync(__dirname + '/../package.json')).version || 'dev');
//program.option('-f, --format [format]', 'Which type of output format [text/json]?')

var command = program.command('status');
command.description('Get the status of a given collection');
command.option('-u, --url [url]', 'Which collection url?');
command.action(function(options) {
    duplicity=new DuplicityCollection(options.url, config);
    duplicity.getStatus(function(err, data) {
        if (err)
        {
            console.error('ERROR: ', data);
        }
        else
        {
            console.log(data);
        }
    });
});

var command = program.command('files');
command.description('List all the files in a specific collection');
command.option('-u, --url [url]', 'Which collection url?');
command.action(function(options) {
    duplicity=new DuplicityCollection(options.url, config);
    duplicity.getCurrentFiles(function(err, data) {
        if (err)
        {
            console.error('ERROR: ', data);
        }
        else
        {
            console.log(data);
        }
    });
});

var command = program.command('verify <directory>');
command.description('Backup a directory');
command.option('-u, --url [url]', 'To collection url?');
command.action(function(directory, options) {
    duplicity=new DuplicityCollection(options.url, config);
    duplicity.verify(directory, function(err, data) {
        if (err)
        {
            console.error('ERROR: ', data);
        }
        else
        {
            console.log(data);
        }
    });
});

var command = program.command('full-backup <directory>');
command.description('Backup a directory');
command.option('-u, --url [url]', 'To collection url?');
command.action(function(directory, options) {
    duplicity=new DuplicityCollection(options.url, config);
    duplicity.createFullBackup(directory, function(err, data) {
        if (err)
        {
            console.error('ERROR: ', data);
        }
        else
        {
            console.log(data);
        }
    });
});
program.parse(process.argv);