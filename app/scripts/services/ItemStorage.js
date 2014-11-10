/*global angular*/

angular.module('webwalletApp').factory('ItemStorage', function (
    $rootScope,
    storage) {

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
     * @param {String} version          Data version.  Stored in localStorage
     *                                  under the key read from param
     *                                  `keyVersion`.
     * @param {String} keyItems         Key under which the items will be
     *                                  stored.  Used like this:
     *                                  `localStorage[keyItems] = items`.
     * @param {String} keyVersion       Key under which the data version will
     *                                  be stored.  Used like this:
     *                                  `localStorage[keyVersion] = version`.
     * @param {Function} [deserialize]  Function that converts a String to item
     *                                  instance.  If not passed,
     *                                  `JSON.parse()` is used.
     * @param {Object} [empty]          Initial value of this empty storage
     *                                  Typically empty Array or empty Object.
     * @param {Boolean} [flagWatch]     Do you want to watch loaded item list
     *                                  for changes and immediately store them
     *                                  to the storage?  Default true.
     */
    function ItemStorage(version, keyItems, keyVersion, deserialize, empty,
            flagWatch) {
        this._version = version;
        this._keyItems = keyItems;
        this._keyVersion = keyVersion;
        this._deserializeFn = deserialize;
        this._empty = empty;
        this._flagWatch = flagWatch;
    }

    ItemStorage.prototype._version = null;
    ItemStorage.prototype._keyItems = null;
    ItemStorage.prototype._keyVersion = null;
    ItemStorage.prototype._deserializeFn = null;

    /**
     * Restore the list of item objects from localStorage and start watching it
     * for changes.  If a change occurs, the changed list is immediately stored
     * in the localStorage.
     *
     * @return {Promise}  Return value of Angular's `$rootScope.$watch()`
     */
    ItemStorage.prototype.init = function () {
        if (!this._flagWatch) {
            return this.load();
        }
        return this._watch(
            this._load()
        );
    };

    /**
     * Store passed item list to localStorage.
     *
     * @param {Array} items  Item list
     */
    ItemStorage.prototype.save = function (items) {
        this._store(
            this._serialize(items)
        );
    };

    /**
     * Restore the data from localStorage and deserialize it, so that the
     * output is a list of item objects.
     *
     * @return {Array}  Item list
     */
    ItemStorage.prototype.load = function () {
        return this._deserialize(
            this._restore()
        );
    };

    /**
     * Watch passed list of item objects for changes.
     *
     * If a change occurs, the changed list is immediately stored
     * in the localStorage.
     *
     * @param {Array} items  Item list
     */
    ItemStorage.prototype._watch = function (items) {
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
     * Serialize a list of item objects to a list of serialized item objects
     * (strings).
     *
     * @param {Array} items        Item list
     * @return {Array of Strings}  Serialized items
     */
    ItemStorage.prototype._serialize = function (items) {
        var key,
            serialized,
            ret;
        if (Array.isArray(items)) {
            ret = items.map(this._serializeItem.bind(this));
        } else if (typeof items === 'object') {
            serialized = {};
            for (key in items) {
                if (items.hasOwnProperty(key)) {
                    serialized[key] = this._serializeItem(items[key]);
                }
            }
            ret = serialized;
        } else {
            ret = this._serializeItem(items);
        }
        return ret;
    };

    /**
     * TODO
     */
    ItemStorage.prototype._serializeItem = function (item) {
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
    ItemStorage.prototype._deserialize = function (data) {
        var key,
            deserialized,
            ret;
        if (Array.isArray(data)) {
            ret = data.map(this._deserializeItem.bind(this));
        } else if (typeof data === 'object') {
            deserialized = {};
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    deserialized[key] = this._deserializeItem(data[key]);
                }
            }
            ret = deserialized;
        } else {
            ret = this._deserializeItem(data);
        }
        return ret;
    };

    ItemStorage.prototype._deserializeItem = function (item) {
        if (typeof this._deserializeFn === 'function') {
            return this._deserializeFn(item);
        }
        return JSON.parse(item);
    };

    /**
     * Store passed list of serialized item objects to localStorage.
     *
     * @param {Array of Strings}  data  Serialized items
     * @return {String}                 The entire list serialized to JSON
     */
    ItemStorage.prototype._store = function (data) {
        var json = JSON.stringify(data);
        storage[this._keyItems] = json;
        storage[this._keyVersion] = this._version;
        return json;
    };

    /**
     * Restore data from the localStorage -- the output is a list of
     * serialized item objects.
     *
     * @return {Array of Strings}  Serialized items
     */
    ItemStorage.prototype._restore = function () {
        var items = storage[this._keyItems],
            version = storage[this._keyVersion];

        if (items && version === this._version) {
            return JSON.parse(items);
        }
        return this._empty || [];
    };

    return ItemStorage;

});
