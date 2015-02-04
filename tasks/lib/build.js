'use strict';

/**
 * Build class
 *
 * @param {Object} properties
 * @constructor
 */
var Build = function (properties) {
    Object.defineProperty(this, 'properties', {value: properties});
};

/**
 * Get the status of the build
 *
 * @returns {String}
 */
Build.prototype.getStatus = function () {
    return this.properties.status || 'unknown';
};

/**
 * Checks whether the build is still
 * running or not
 *
 * @returns {boolean}
 */
Build.prototype.isRunning = function () {
    return -1 !== ['running', 'scheduled', 'queued', 'not_running'].indexOf(this.getStatus());
};

/**
 * Checks whether the build has succeed
 * or not
 *
 * @returns {boolean}
 */
Build.prototype.isSuccess = function () {
    return -1 !== ['success', 'fixed', 'not_run'].indexOf(this.getStatus());
};

/**
 * Checks whether the build has failed
 * or not
 *
 * @returns {boolean}
 */
Build.prototype.isFailure = function () {
    return !this.isSuccess() && !this.isRunning();
};


module.exports = Build;
