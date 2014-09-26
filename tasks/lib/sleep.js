'use strict';

var q = require('q');

/**
 * Sleeps for N milliseconds
 *
 * @param {Number} milliseconds
 */
module.exports = function (milliseconds) {
    var deferred = q.defer();

    setTimeout(function () {
        deferred.resolve(1);
    }, milliseconds);

    return deferred.promise;
};
