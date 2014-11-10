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

Object.prototype.equals = function (obj) {
    'use strict';

    var prop;

    for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (!this.hasOwnProperty(prop)) {
                return false;
            }
            if (this[prop] !== obj[prop]) {
                return false;
            }
        }
    }

    for (prop in this) {
        if (this.hasOwnProperty(prop)) {
            if (!obj.hasOwnProperty(prop)) {
                return false;
            }
        }
    }

    return true;
};
