(function (
    angular,
    localStorage,
    sessionStorage) {

    'use strict';

    angular.module('webwalletApp').factory('LocalItemStorage', function (
            BaseItemStorage) {

        /**
         * TODO
         *
         * @param {Function} [deserialize]  Function that converts a String to item
         *                                  instance.  If not passed,
         *                                  `JSON.parse()` is used.
         */
        function LocalItemStorage(version, keyItems, keyVersion, deserializeFn) {

            BaseItemStorage.call(this, version, keyItems, keyVersion);

            this._deserializeFn = deserializeFn;
        }

        LocalItemStorage.prototype = Object.create(BaseItemStorage.prototype);
        LocalItemStorage.prototype.constructor = LocalItemStorage;

        LocalItemStorage.prototype._deserializeFn = null;

        /**
         * Serialize a list of item objects to a list of serialized item objects
         * (strings).
         *
         * @param {Array} items        Item list
         * @return {Array of Strings}  Serialized items
         */
        LocalItemStorage.prototype._serialize = function (items) {
            var key,
                serialized;
            if (items === null || items === undefined) {
                return items;
            }
            if (Array.isArray(items)) {
                return items.map(this._serializeItem.bind(this));
            }
            if (typeof items === 'object') {
                serialized = {};
                for (key in items) {
                    if (items.hasOwnProperty(key)) {
                        serialized[key] = this._serializeItem(items[key]);
                    }
                }
                return serialized;
            }
            return this._serializeItem(items);
        };

        LocalItemStorage.prototype._serializeItem = function (item) {
            if (typeof item.serialize === 'function') {
                return item.serialize();
            }
            return JSON.stringify(item);
        };

        /**
         * Deserialize an item list -- return a list of item objects from passed
         * list of serialized item objects (strings).
         *
         * @param {Array of Strings}  data  Serialized items
         * @return {Array}                  Item list
         */
        LocalItemStorage.prototype._deserialize = function (data) {
            var key,
                deserialized;
            if (data === null || data === undefined) {
                return data;
            }
            if (Array.isArray(data)) {
                return data.map(this._deserializeItem.bind(this));
            }
            if (typeof data === 'object') {
                deserialized = {};
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        deserialized[key] = this._deserializeItem(data[key]);
                    }
                }
                return deserialized;
            }
            return this._deserializeItem(data);
        };

        LocalItemStorage.prototype._deserializeItem = function (item) {
            if (typeof this._deserializeFn === 'function') {
                return this._deserializeFn(item);
            }
            return JSON.parse(item);
        };

        LocalItemStorage.prototype.get = function (key, callback) {
            var val = localStorage[key],
                parsed;
            if (val === undefined) {
                callback(val);
                return;
            }
            try {
                parsed = JSON.parse(val);
                callback(parsed);
            } catch (e) {
                callback(val);
            }
        };

        LocalItemStorage.prototype.set = function (key, val) {
            if (typeof val === 'object') {
                localStorage[key] = JSON.stringify(val);
            } else {
                localStorage[key] = val;
            }
        };

        return LocalItemStorage;
    });

    angular.module('webwalletApp').value('temporaryStorage',
        sessionStorage || {});

}(
    this.angular,
    this.localStorage,
    this.sessionStorage));
