'use strict';

var BuildFinder = require('../tasks/lib/buildFinder'),
    Build       = require('../tasks/lib/build'),
    finder;


module.exports = {
    setUp: function (done) {
        finder = new BuildFinder([{vcs_revision: 'hashofthecommit'}]);
        done();
    },

    'finds by commit': function (test) {
        test.strictEqual(finder.findByCommit('hashofthecommit') instanceof Build, true, 'should return an instance of Build');
        test.done();
    },

    'returns null if build not found': function (test) {
        test.strictEqual(finder.findByCommit('error'), null, 'should return null');
        test.done();
    }
};
