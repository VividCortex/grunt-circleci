'use strict';


var Build = require('./build'), BuildFinder;

/**
 * Allows to find builds in a collection
 *
 * @param {Array} builds
 * @constructor
 */
BuildFinder = function (builds) {
    Object.defineProperty(this, 'builds', {value: builds});
};

/**
 * Finds a build by the vcs revision
 *
 * @param {String} commit The commit hash
 * @returns {Build|null}
 */
BuildFinder.prototype.findByCommit = function (commit) {
    var activeBuilds = this.builds.filter(function (build) {
        return commit === build.vcs_revision;
    });

    // Check if there are matching builds
    if (!activeBuilds.length) {
        return null;
    }

    // get the first matching build
    return new Build(activeBuilds.shift());
};


module.exports = BuildFinder;
