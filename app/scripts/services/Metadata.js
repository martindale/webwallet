/*global angular*/

angular.module('webwalletApp').factory('metadata', function (
    _,
    config,
    ItemStorage) {

    'use strict';

    /**
     * Metadata
     *
     * @constructor
     */
    function Metadata() {
        this._storage = new ItemStorage(
            config.storageVersion,
            this.STORAGE_METADATA,
            this.STORAGE_METADATA_VERSION,
            null,
            {},
            false
        );
        this._data = this._storage.init();
    }

    Metadata.prototype.STORAGE_METADATA = 'trezorMetadata';
    Metadata.prototype.STORAGE_METADATA_VERSION = 'trezorMetadataVersion';

    /**
     * TODO
     */
    Metadata.prototype.save = function () {
        this._storage.save(this._data);
    };

    /**
     * TODO
     */
    Metadata.prototype.getAllAddressLabels = function () {
        if (this._data.addresses) {
            return _.clone(this._data.addresses);
        }
        return {};
    };

    /**
     * TODO
     */
    Metadata.prototype.getAddressLabel = function (addr) {
        if (this._data.addresses) {
            return this._data.addresses[addr];
        }
    };

    /**
     * TODO
     */
    Metadata.prototype.setAddressLabel = function (addr, label) {
        if (!this._data.addresses) {
            this._data.addresses = {};
        }
        if (label !== null && label !== undefined) {
            this._data.addresses[addr] = label;
        } else if (this._data.addresses[addr]) {
            delete this._data.addresses[addr];
        }
    };

    /**
     * TODO
     */
    Metadata.prototype.getOutputLabel = function (txHash, index) {
        throw new Error('Not implemented yet.');
    };

    /**
     * TODO
     */
    Metadata.prototype.getTxLabel = function (txHash) {
        throw new Error('Not implemented yet.');
    };

    return new Metadata();

});
