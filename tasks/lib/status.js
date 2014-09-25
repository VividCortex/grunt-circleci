'use strict';


var q           = require('q'),
    CircleCI    = require('circleci'),
    sleep       = require('./sleep'),
    BuildFinder = require('./buildFinder'),
    Checker;


Checker = function (token, username, project, options) {
    Object.defineProperties(this, {
        circleci: {value: new CircleCI({auth: token}), writable: false, enumerable: false},
        username: {value: username, writable: false, enumerable: false},
        project: {value: project, writable: false, enumerable: false},
        options: {value: options || {}, writable: false, enumerable: false}
    });
};

Object.defineProperty(Checker, 'defaultOptions', {
    enumerable: true,
    configurable: false,
    writable: false,
    value: {
        branch: 'master',
        sleepTime: 2e4, // Waits 20 seconds
        timeout: 10 * 60 * 1e3, // 10 minutes timeout
        waitOnRunning: false // Fail if running
    }
});

Checker.prototype = Object.create(Object.prototype, {
    hasOption: {
        value: function (name) {
            return undefined !== this.options[name];
        }
    },

    getOption: {
        value: function (name, defaultValue) {
            if (!this.hasOption(name)) {
                return defaultValue;
            }

            return this.options[name];
        }
    },

    handleError: {
        value: function (reason) {
            return q.reject(reason);
        }
    },

    getBuilds: {
        value: function () {
            var route = {method: "GET", path: "/project/:username/:project", options: ["limit"]},
                xhrSettings = {
                    username: this.username,
                    project: this.project,
                    limit: 5
                };

            if (this.hasOption('branch')) {
                route.path += "/tree/:branch";
                xhrSettings.branch = this.getOption('branch');
            }

            return this.circleci.request.process(route, xhrSettings);
        }
    },

    checkCommit: {
        enumerable: true,

        /**
         * Checks the build status of a commit
         *
         * @param {String} commit  The commit hash
         * @param {Number} [until] For how long should be check if the build
         *                         is still running
         * @returns {*|!Promise}
         */
        value: function (commit, until) {
            var checker = this;

            until = !isNaN(until) ? until : (new Date()).getTime() + (this.getOption('timeout', 600));

            if ((new Date()).getTime() > until) {
                return this.handleError('Timeout');
            }

            return this.getBuilds()
                .then(function (builds) {
                    if (undefined !== builds.message) {
                        return checker.handleError(builds.message);
                    }

                    var finder = new BuildFinder(builds),
                        build = finder.findByCommit(commit);

                    if (null === build) {
                        return checker.handleError('Build not found');
                    }

                    return build;
                }, this.handleError)

                .then(function (build) {
                    if (build.isSuccess()) {
                        return true;
                    } else if (build.isFailure() || !checker.getOption('waitOnRunning', false)) {
                        return checker.handleError('Invalid status for CircleCI build: "' + build.getStatus() + '"')
                    }

                    // Sleep for 10 seconds by default
                    sleep(checker.getOption('sleepTime', 1e4));

                    return checker.checkCommit(commit, until);
                }, this.handleError);
        }
    }
});

module.exports = Checker;
