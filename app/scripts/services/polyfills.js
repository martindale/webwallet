Array.prototype.equals = function (array) {
    'use strict';

    if (!array || this.length !== array.length) {
        return false;
    }

    for (var i = 0, l = this.length; i < l; i = i + 1) {
        if (this[i] !== array[i]) {
            return false;
        }
    }
    return true;
};
