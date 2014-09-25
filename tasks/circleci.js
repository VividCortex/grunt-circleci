'use strict';

/**
 * Sleeps for N seconds
 *
 * @param {Number} seconds
 */
function sleep(seconds) {
    var future = (new Date()).getTime() + (seconds * 1e3);

    // Do nothing
    while (future > (new Date()).getTime()) {
        /* jshint noempty: false */
    }
}

module.exports = function (grunt) {
    var StatusChecker = require('./lib/status');

    function getConfig(key) {
        return grunt.config.get('circleci.' + key);
    }


    grunt.registerTask('circleci', 'Grunt plugin to work with CircleCI API', function () {
        this.requiresConfig('circleci.token', 'circleci.username', 'circleci.project', 'circleci.commit');

        var done = this.async(), statusChecker, options;

        options = this.options(StatusChecker.defaultOptions);

        statusChecker = new StatusChecker(getConfig('token'), getConfig('username'), getConfig('project'), options);

        statusChecker.checkCommit(getConfig('commit')).then(function () {
            done(true);
        }, function (result) {
            grunt.log.error(result);

            done(false);
        });
    });
};
