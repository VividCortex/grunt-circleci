'use strict';


/**
 * Sleeps for N milliseconds
 *
 * @param {Number} milliseconds
 */
module.exports = function (milliseconds) {
    var future = (new Date()).getTime() + milliseconds;

    // Do nothing
    while (future > (new Date()).getTime()) {
        /* jshint noempty: false */
    }
};
