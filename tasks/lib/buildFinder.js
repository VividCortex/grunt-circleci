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
 * Finds builds by the vcs revision
 *
 * @param {String} commit The commit hash
 * @returns {Array|null}
 */
 BuildFinder.prototype.findByCommit = function (commit) {
     var activeBuilds = this.builds.filter(function (build) {
         return commit === build.vcs_revision;
     });

     // Check if there are matching builds
     if (!activeBuilds.length) {
         return null;
     }

     return activeBuilds.map(function (activeBuild) {
         return new Build(activeBuild);
     });
 };


module.exports = BuildFinder;
