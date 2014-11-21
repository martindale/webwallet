/*global angular*/

angular.module('webwalletApp').factory('BaseItemStorage', function (
    $rootScope) {

    'use strict';

    /**
     * Item storage -- persist a list of item instances in localStorage.
     *
     * Item instance can be either a class instance or an Object.
     *
     * If an instance implements method `serialize()`, then this method is used
     * to convert instance to String.  Otherwise `JSON.stringify()` is used.
     *
     * If optional param `deserialize` is passed, then this function is used
     * to convert String to instance.  Otherwise `JSON.parse()` is used.
     *
     * @constructor
     *
     * @param {String} version          Data version.  Stored in the storage
     *                                  under the key read from param
     *                                  `keyVersion`.
     * @param {String} keyItems         Key under which the items will be
     *                                  stored.  Used like this:
     *                                  `storage.set(keyItems, items)`.
     * @param {String} keyVersion       Key under which the data version will
     *                                  be stored.  Used like this:
     *                                  `storage.set(keyVersion, version)`.
     */
    function BaseItemStorage(version, keyItems, keyVersion) {
        this._version = version;
        this._keyItems = keyItems;
        this._keyVersion = keyVersion;
    }

    BaseItemStorage.prototype._version = null;
    BaseItemStorage.prototype._keyItems = null;
    BaseItemStorage.prototype._keyVersion = null;

    /**
     * Store passed item list to the storage.
     *
     * TODO
     */
    BaseItemStorage.prototype.save = function (items) {
        this._store(
            this._serialize(items)
        );
    };

    /**
     * Restore the data from the storage and deserialize it, so that the
     * output is a list of item objects.
     *
     * TODO
     */
    BaseItemStorage.prototype.load = function (callback) {
        this._restore(function (items) {
            callback(this._deserialize(items));
        }.bind(this));
    };

    /**
     * Watch passed list of item objects for changes.
     *
     * If a change occurs, the changed list is immediately stored
     * in the storage.
     *
     * TODO
     */
    BaseItemStorage.prototype.watch = function (items) {
        $rootScope.$watch(
            function () {
                return this._serialize(items);
            }.bind(this),
            function (data) {
                this._store(data);
            }.bind(this),
            true // deep compare
        );
        return items;
    };

    /**
     * TODO
     */
    BaseItemStorage.prototype._serialize = function (items) {
        return items;
    };

    /**
     * TODO
     */
    BaseItemStorage.prototype._deserialize = function (items) {
        return items;
    };

    /**
     * Store passed list of serialized item objects to the storage.
     *
     * TODO
     */
    BaseItemStorage.prototype._store = function (data) {
        this.set(this._keyItems, data);
        this.set(this._keyVersion, this._version);
        return data;
    };

    /**
     * Restore data from the storage -- the output is a list of
     * serialized item objects.
     *
     * TODO
     */
    BaseItemStorage.prototype._restore = function (callback) {
        this.get(this._keyVersion, function (version) {
            if (version !== this._version) {
                callback();
                return;
            }
            this.get(this._keyItems, function (items) {
                callback(items);
            }.bind(this));
        }.bind(this));
    };

    BaseItemStorage.prototype.get = function (key, callback) {
        throw new Error(
            'BaseItemStorage#get(): Child class must implement this method.'
        );
    };

    BaseItemStorage.prototype.set = function (key, val) {
        throw new Error(
            'BaseItemStorage#set(): Child class must implement this method.'
        );
    };

    return BaseItemStorage;

});
