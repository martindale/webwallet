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
    function Metadata() {
        this._storage = new RemoteItemStorage(
            config.storageVersion,
            this.STORAGE_METADATA,
            this.STORAGE_METADATA_VERSION
        );
    }

    Metadata.prototype.STORAGE_METADATA = 'trezorMetadata';
    Metadata.prototype.STORAGE_METADATA_VERSION = 'trezorMetadataVersion';

    Metadata.prototype._storage = null;
    Metadata.prototype._data = null;
    Metadata.prototype._promise = null;
    Metadata.prototype._done = false;

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
            this._data = items || {};
            this._done = true;
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

    Metadata.prototype.getAllAddressLabels = function (callback) {
        this._getData(function (data) {
            if (data && data.addresses) {
                callback(_.clone(data.addresses));
            }
        });
    };

    Metadata.prototype.getAddressLabel = function (addr, callback) {
        this._getData(function (data) {
            if (data && data.addresses) {
                callback(data.addresses[addr]);
            }
        });
    };

    Metadata.prototype.setAddressLabel = function (addr, label) {
        this._getData(function (data) {
            if (!data.addresses || typeof data.addresses !== 'object') {
                data.addresses = {};
            }
            if (label !== null && label !== undefined) {
                data.addresses[addr] = label;
            } else if (data.addresses[addr]) {
                delete data.addresses[addr];
            }
        });
    };

    Metadata.prototype.getOutputLabel = function (txHash, index, callback) {
        throw new Error('Not implemented yet.');
    };

    Metadata.prototype.getTxLabel = function (txHash, callback) {
        throw new Error('Not implemented yet.');
    };

    return new Metadata();

});
