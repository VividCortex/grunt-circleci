'use strict';

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
