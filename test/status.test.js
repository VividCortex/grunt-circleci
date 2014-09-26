'use strict';

var q               = require('q'),
    SandboxedModule = require('sandboxed-module'),
    afterPromise,
    deferreds,
    StatusChecker, checker;


module.exports = {
    setUp: function (done) {
        /**
         * Mocking CircleCI's module
         */
        var circleci = function () {
            this.request = {
                process: function () {
                    var deferred = q.defer();
                    deferreds.push(deferred);

                    return deferred.promise.finally(afterPromise);
                }
            };
        };

        afterPromise = function () { };
        StatusChecker = SandboxedModule.require('../tasks/lib/status', {
            requires: {
                circleci: circleci,
                './sleep': function () {
                    return {
                        then: function (callback) {
                            return callback();
                        }
                    };
                }
            }
        });

        checker = new StatusChecker('invalidToken', 'username', 'project', {branch: 'branch'});
        deferreds = [];

        done();
    },
    tearDown: function (done) {
        checker = null;
        deferreds.length = 0;
        done();
    },


    'rejects with the sent message': function (test) {
        test.expect(1);

        checker.checkCommit('commit').then(function () {
            test.ok(false, 'Should not be here');
        }, function (message) {
            test.strictEqual(message, 'Error message');
        }).finally(function () {
            test.done();
        });

        deferreds.shift().resolve({message: 'Error message'});
    },

    'rejects if there are no builds': function (test) {
        test.expect(1);

        checker.checkCommit('commit').then(function () {
            test.ok(false, 'Should not be here');
        }, function (message) {
            test.strictEqual(message, 'Build not found');
        }).finally(function () {
            test.done();
        });

        deferreds.shift().resolve([]);
    },

    'rejects if build is not found': function (test) {
        test.expect(1);

        checker.checkCommit('commit3').then(function () {
            test.ok(false, 'Should not be here');
        }, function (message) {
            test.strictEqual(message, 'Build not found');
        }).finally(function () {
            test.done();
        });

        deferreds.shift().resolve([{vcs_revision: 'commit1'}, {vcs_revision: 'commit2'}]);
    },

    'rejects if the build is not successful': function (test) {
        test.expect(1);

        checker.checkCommit('commit').then(function () {
            test.ok(false, 'Should not be here');
        }, function (message) {
            test.strictEqual(message, 'Invalid status for CircleCI build: "error"');
        }).finally(function () {
            test.done();
        });

        deferreds.shift().resolve([{vcs_revision: 'commit', status: 'error'}]);
    },

    'rejects if running': function (test) {
        test.expect(1);

        checker.checkCommit('commit').then(function () {
            test.ok(false, 'Should not be here');
        }, function (message) {
            test.strictEqual(message, 'Invalid status for CircleCI build: "running"');
        }).finally(function () {
            test.done();
        });

        deferreds.shift().resolve([{vcs_revision: 'commit', status: 'running'}]);
    },

    'resolves if the build is successful': function (test) {
        test.expect(1);

        checker.checkCommit('commit').then(function (result) {
            test.strictEqual(result, true, 'should return TRUE');
        }).finally(function () {
            test.done();
        });

        deferreds.shift().resolve([{vcs_revision: 'commit', status: 'success'}]);
    },

    'waits until the build finishes when running': function (test) {
        var statuses = ['running', 'running', 'success'],
            resolutionsCount = 0,
            timeout;

        checker = new StatusChecker('invalidToken', 'username', 'project', {branch: 'branch', retryOnRunning: true});

        afterPromise = function () {
            timeout = setTimeout(function () {
                var deferred = deferreds.shift();

                if (!!deferred) {
                    resolutionsCount += 1;
                    deferred.resolve([{vcs_revision: 'commit', status: statuses.shift()}]);
                }
            }, 0);
        };

        test.expect(2);

        checker.checkCommit('commit').then(function (result) {
            test.strictEqual(result, true, 'should return TRUE');
            test.strictEqual(resolutionsCount, 3, 'the number of resolutions should be 3');
        }).finally(function () {
            test.done();
            clearTimeout(timeout);
        });

        deferreds.shift().resolve([{vcs_revision: 'commit', status: 'running'}]);
    },

    'it timeouts if the build runs for too long': function (test) {
        var timeout;

        checker = new StatusChecker('invalidToken', 'username', 'project', {
            branch: 'branch',
            retryOnRunning: true,
            retryAfter: 100,
            timeout: 300
        });

        afterPromise = function () {
            timeout = setTimeout(function () {
                var deferred = deferreds.shift();
                if (!!deferred) {
                    deferred.resolve([{vcs_revision: 'commit', status: 'running'}]);
                }
            }, 0);
        };

        test.expect(1);

        checker.checkCommit('commit').then(function () {
            test.ok(false, 'Should not be here');
        }, function (message) {
            test.strictEqual(message, 'Timeout');
        }).finally(function () {
            test.done();
            clearTimeout(timeout);
        });

        deferreds.shift().resolve([{vcs_revision: 'commit', status: 'running'}]);
    }
};
