var fs = require('fs');
var wrench = require('wrench');

var assert = require("assert");
var DuplicityCollection = require('./../src/collection');

var config = {};
config.duplicity_command = config.duplicity_command || 'duplicity';
config.env = config.env || {};
config.env['PASSPHRASE'] = 'hans';
config.env['LANG'] = 'en_US.UTF-8';
config.env['PATH'] = process.env['PATH'];

describe('CreateVerifyDelete', function () {
	this.timeout(5000);

	try {
		wrench.rmdirSyncRecursive(__dirname + '/results/create_verify_delete');
	}
	catch (error) {

	}

	var collection = new DuplicityCollection('file://' + __dirname + '/results/create_verify_delete', config);

	it('should create a full backup', function (done) {
		collection.createFullBackup(__dirname + '/fixtures', function (err, data) {
			assert.equal(false, err);
			assert.equal(2, data.SourceFiles);
			assert.equal(2, data.NewFiles);
			assert.equal(2, data.DeltaEntries);
			done();
		});
	});

	it('should create an incremental backup', function (done) {
		collection.createIncrementalBackup(__dirname + '/fixtures', function (err, data) {
			assert.equal(false, err);
			assert.equal(2, data.SourceFiles);
			assert.equal(0, data.NewFiles);
			assert.equal(0, data.DeltaEntries);
			done();
		});
	});

	it('should verify the backup', function (done) {
		collection.verify(__dirname + '/fixtures', function (err, data) {
			assert.equal(false, err);
			assert.equal(0, data.newFiles.length);
			assert.equal(0, data.deletedFiles.length);
			assert.equal(0, data.modifiedFiles.length);
			assert.equal(0, data.otherDifferences.length);
			done();
		});
	});

	it('should be able to retrieve the current files of the backup', function (done) {
		collection.getCurrentFiles(function (err, files) {
			assert.equal(false, err);
			assert.equal(2, files.length);
			done();
		});
	});

	it('should retrieve the status of the backup', function (done) {
		collection.getStatus(function (err, data) {
			assert.equal(false, err);
			assert.equal(2, data.length);
			assert.equal("Full", data[0].type);
			assert.equal(1, data[0].volumes);
			assert.equal("Incremental", data[1].type);
			assert.equal(1, data[1].volumes);
			done();
		});
	});
});

