'use strict';

var Build = require('../tasks/lib/build');


module.exports = {
    'running on status "running"': function (test) {
        var build = new Build({status: 'running'});

        test.strictEqual(build.isRunning(), true, 'should report as running when status is "running"');
        test.done();
    },

    'running on status "scheduled"': function (test) {
        var build = new Build({status: 'scheduled'});

        test.strictEqual(build.isRunning(), true, 'should report as running when status is "scheduled"');
        test.done();
    },

    'running on status "queued"': function (test) {
        var build = new Build({status: 'queued'});

        test.strictEqual(build.isRunning(), true, 'should report as running when status is "queued"');
        test.done();
    },

    'running on status "not_running"': function (test) {
        var build = new Build({status: 'not_running'});

        test.strictEqual(build.isRunning(), true, 'should report as running when status is "not_running"');
        test.done();
    },

    'success on status "success"': function (test) {
        var build = new Build({status: 'success'});

        test.strictEqual(build.isSuccess(), true, 'should report as success when the status is "success"');
        test.done();
    },

    'success on status "fixed"': function (test) {
        var build = new Build({status: 'fixed'});

        test.strictEqual(build.isSuccess(), true, 'should report as success when the status is "fixed"');
        test.done();
    },

    'success on status "not_run"': function (test) {
        var build = new Build({status: 'not_run'});

        test.strictEqual(build.isSuccess(), true, 'should report as success when the status is "not_run"');
        test.done();
    },

    'error on status "error"': function (test) {
        var build = new Build({status: 'error'});

        test.strictEqual(build.isSuccess(), false, 'should report as not success when the status is "error"');
        test.done();
    },

    'error on status "anything"': function (test) {
        var build = new Build({status: 'anything'});

        test.strictEqual(build.isSuccess(), false, 'should report as not success when the status is "anything"');
        test.done();
    }
};
