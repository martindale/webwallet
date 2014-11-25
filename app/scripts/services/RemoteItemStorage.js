(function (
    angular,
    RemoteStorage,
    remoteStorage) {

    'use strict';

    angular.module('webwalletApp').factory('RemoteItemStorage', function (
            BaseItemStorage) {

        function RemoteItemStorage(version, keyItems, keyVersion, path) {

            BaseItemStorage.call(this, version, keyItems, keyVersion);

            RemoteStorage.defineModule(this.REMOTE_STORAGE_MODULE,
                    function (privateClient) {

                privateClient.declareType(this.REMOTE_STORAGE_TYPE, {
                    type: 'object',
                });

                return {
                    exports: {
                        getKey: function (path, val) {
                            return this._getKey(privateClient, path, val);
                        }.bind(this),
                        setKey: function (path, val) {
                            return this._setKeyObj(privateClient, path, val);
                        }.bind(this),
                        watch: function (objects) {
                            return this._watch(privateClient, objects);
                        }.bind(this)
                    }
                };
            }.bind(this));

            remoteStorage.access.claim(this.REMOTE_STORAGE_MODULE, 'rw');
            remoteStorage.displayWidget();

            this._path = path;
        }

        RemoteItemStorage.prototype = Object.create(BaseItemStorage.prototype);
        RemoteItemStorage.prototype.constructor = RemoteItemStorage;

        RemoteItemStorage.prototype.REMOTE_STORAGE_MODULE = 'mytrezor.com';
        RemoteItemStorage.prototype.REMOTE_STORAGE_TYPE = 'value';

        RemoteItemStorage.prototype._path = null;

        RemoteItemStorage.prototype._getAll = function (client, path, callback) {
            client.getAll(path, false)
                .then(function (objects) {
                    console.log('RemoteItemStorage#_getAll()', objects);
                    callback(objects);
                }.bind(this), function (err) {
                    console.warn('RemoteItemStorage#_getAll()',err);
                    callback(null);
                });
        };

        RemoteItemStorage.prototype._getKey = function (client, path,
                callback) {
            var pos = path.lastIndexOf('/'),
                dir,
                filename;
            if (pos !== -1 && pos !== path.length) {
                dir = path.slice(0, pos + 1);
                filename = path.slice(pos + 1);
                this._getAll(client, dir, function (objects) {
                    if (objects) {
                        console.log('RemoteItemStorage#_getKey()', dir, filename,
                            objects[filename]);
                        callback(objects[filename] || null);
                        return;
                    }
                    console.log('RemoteItemStorage#_getKey()', dir, filename,
                        objects);
                    callback(objects);
                });
                return;
            }
            client.getObject(path, false)
                .then(function (object) {
                    if (object) {
                        callback(object.value);
                    } else {
                        callback(object);
                    }
                });
        };

        RemoteItemStorage.prototype._setKeyObj = function (client, path, val) {
            var key;
            if (typeof val === 'object') {
                for (key in val) {
                    if (val.hasOwnProperty(key)) {
                        this._setKeyObj(
                            client,
                            [path, key].join('/'),
                            val[key]
                        );
                    }
                }
            } else {
                this._setKey(client, path, val);
            }
        };

        RemoteItemStorage.prototype._setKey = function (client, path, val) {
            console.log('RemoteItemStorage#_setKey()', path, val);
            client.storeObject(
                this.REMOTE_STORAGE_TYPE,
                path,
                {value: val}
            );
        }

        RemoteItemStorage.prototype._watch = function (client, objects) {
            client.on('change', function (e) {
                var pos,
                    keys,
                    i,
                    l,
                    cur;
                if (origin === 'remote' || origin === 'conflict') {
                    pos = e.path.indexOf(this._keyItems);
                    if (pos === 0 && pos !== e.path.length) {
                        keys = e.path.slice(pos + 1);
                        console.log(e, this._keyItems, keys);
                        keys.split('/');
                        curObjs = objects;
                        for (i = 0, l = keys.length; i < l; i = i + 1) {
                            curObjs = curObjs[i];
                        }
                        // TODO Resolve conflicts
                        curObjs = e.newValue;
                    }
                }
                console.log(e, this._keyItems);
            });
        };

        RemoteItemStorage.prototype.get = function (path, callback) {
            return remoteStorage[this.REMOTE_STORAGE_MODULE]
                .getKey(path, callback);
        };

        RemoteItemStorage.prototype.set = function (path, val) {
            return remoteStorage[this.REMOTE_STORAGE_MODULE]
                .setKey(path, val);
        };

        RemoteItemStorage.prototype.watch = function (objects) {
            return remoteStorage[this.REMOTE_STORAGE_MODULE]
                .watch(objects);
        };

        return RemoteItemStorage;
    });

}(
    this.angular,
    this.RemoteStorage,
    this.remoteStorage));
