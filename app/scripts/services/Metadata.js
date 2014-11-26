/*global angular*/

angular.module('webwalletApp').factory('metadata', function (
    _,
    $q,
    config,
    RemoteItemStorage) {

    'use strict';

    /**
     * Metadata
     *
     * @constructor
     */
    function Metadata() {}

    Metadata.prototype.STORAGE_METADATA = 'trezorMetadata';
    Metadata.prototype.STORAGE_METADATA_VERSION = 'trezorMetadataVersion';

    Metadata.prototype._storage = null;
    Metadata.prototype._data = null;
    Metadata.prototype._promise = null;
    Metadata.prototype._done = false;

    Metadata.prototype.init = function (device, account) {
        this._storage = new RemoteItemStorage(
            config.storageVersion,
            [this.STORAGE_METADATA, device, account, ''].join('/'),
            this.STORAGE_METADATA_VERSION
        );
    };

    Metadata.prototype._getData = function (callback) {
        var deferred;

        if (this._data !== null) {
            callback(this._data);
            return;
        }
        /*
         * If we are already loading the data, do not trigger another data
         * loading, but rather put the callback to the queue of callbacks,
         * which will be fired once the data loading finishes.
         */
        if (this._promise !== null) {
            this._promise = this._promise.then(callback);
            return;
        }

        deferred = $q.defer();
        this._promise = deferred.promise;

        this._storage.load(function (items) {
            this._done = true;
            this._data = items || {};
            this._storage.watch(this._data);
            callback(this._data);
            deferred.resolve(items);
        }.bind(this));
    };

    Metadata.prototype.isLoading = function () {
        return !this._done;
    };

    Metadata.prototype.save = function () {
        this._getData(function (data) {
            this._storage.save(data);
        }.bind(this));
    };

    Metadata.prototype._getLabel = function (key, callback) {
        this._getData(function (data) {
            if (data) {
                callback(data[key]);
            } else {
                callback(undefined);
            }
        });
    };

    Metadata.prototype.getAddressLabel = function (addr, callback) {
        this._getLabel(addr, callback);
    };

    Metadata.prototype.getOutputLabel = function (txHash, index, callback) {
        this._getLabel(txHash + index, callback);
    };

    Metadata.prototype.getTxLabel = function (txHash, callback) {
        this._getLabel(txHash, callback);
    };

    Metadata.prototype._setLabel = function (key, label) {
        this._getData(function (data) {
            if (label !== null && label !== undefined) {
                data[key] = label;
            } else if (data[key]) {
                delete data[key];
            }
        });
    };

    Metadata.prototype.setAddressLabel = function (addr, label) {
        this._setLabel(addr, label);
    };

    Metadata.prototype.getOutputLabel = function (txHash, index, label) {
        this._setLabel(txHash + index, label);
    };

    Metadata.prototype.getTxLabel = function (txHash, label) {
        this._setLabel(txHash, label);
    };

    Metadata.prototype._getAllLabels = function (callback) {
        this._getData(function (data) {
            if (data) {
                callback(_.clone(data));
            } else {
                callback({});
            }
        });
    };

    Metadata.prototype.getAllAddressLabels = Metadata.prototype._getAllLabels;

    return new Metadata();

});
