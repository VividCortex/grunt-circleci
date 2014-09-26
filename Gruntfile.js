/*
 * grunt-circleci
 * https://github.com/VividCortex/grunt-circleci
 *
 * Copyright (c) 2014 Ismael Ambrosi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'src/**/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        gitinfo: {},

        // Configuration to be run (and then tested).
        circleci: {
            token: process.env.CIRCLE_CI_TOKEN,                // CircleCI's API token
            commit: '<%= gitinfo.local.branch.current.SHA %>', // Current commit hash
            username: 'VividCortex',
            project: 'ng-app',
            options: {
                retryOnRunning: true
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*.test.js']
        },

        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-bump');

    grunt.loadNpmTasks('grunt-gitinfo');

    // Alias for nodeunit
    grunt.registerTask('test', ['nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

    grunt.registerTask('check-build', ['gitinfo', 'circleci']);

};
