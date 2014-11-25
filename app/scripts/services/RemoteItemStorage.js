(function (
    angular,
    RemoteStorage,
    remoteStorage) {

    'use strict';

    angular.module('webwalletApp').factory('RemoteItemStorage', function (
            BaseItemStorage) {

        function RemoteItemStorage(version, keyItems, keyVersion) {

            BaseItemStorage.call(this, version, keyItems, keyVersion);

            RemoteStorage.defineModule(this.REMOTE_STORAGE_DIR,
                    function (privateClient) {

                privateClient.declareType(this.REMOTE_STORAGE_TYPE, {
                    type: 'object',
                });

                return {
                    exports: {
                        getKey: function (key, val) {
                            return this._getKey(privateClient, key, val);
                        }.bind(this),
                        setKey: function (key, val) {
                            return this._setKey(privateClient, key, val);
                        }.bind(this),
                    }
                };
            }.bind(this));

            remoteStorage.access.claim(this.REMOTE_STORAGE_DIR, 'rw');
            remoteStorage.displayWidget();
        }

        RemoteItemStorage.prototype = Object.create(BaseItemStorage.prototype);
        RemoteItemStorage.prototype.constructor = RemoteItemStorage;

        RemoteItemStorage.prototype.REMOTE_STORAGE_DIR = 'mytrezor.com';
        RemoteItemStorage.prototype.REMOTE_STORAGE_TYPE = 'map';
        RemoteItemStorage.prototype.REMOTE_STORAGE_KEY = 'object';

        RemoteItemStorage.prototype._mapCache = null;

        RemoteItemStorage.prototype._loadMap = function (client, callback) {
            if (this._mapCache !== null) {
                callback(this._mapCache);
                return;
            }
            client.getObject(this.REMOTE_STORAGE_KEY, false)
                .then(function (map) {
                    console.log('RemoteItemStorage#_loadMap()', map);
                    callback(map);
                }.bind(this));
        };

        RemoteItemStorage.prototype._getKey = function (client, key, callback) {
            this._loadMap(client, function (map) {
                if (map) {
                    callback(map[key]);
                } else {
                    callback(map);
                }
            });
        };

        RemoteItemStorage.prototype._setKey = function (client, key, val) {
            this._loadMap(client, function (map) {
                if (!map || typeof map !== 'object') {
                    map = {};
                }
                map[key] = val;
                this._mapCache = map;
                console.log('RemoteItemStorage#_doSetKey()', map);
                client.storeObject(
                    this.REMOTE_STORAGE_TYPE,
                    this.REMOTE_STORAGE_KEY,
                    map
                );
            }.bind(this));
        };

        RemoteItemStorage.prototype.get = function (key, callback) {
            return remoteStorage[this.REMOTE_STORAGE_DIR]
                .getKey(key, callback);
        };

        RemoteItemStorage.prototype.set = function (key, val) {
            return remoteStorage[this.REMOTE_STORAGE_DIR]
                .setKey(key, val);
        };

        return RemoteItemStorage;
    });

}(
    this.angular,
    this.RemoteStorage,
    this.remoteStorage));
