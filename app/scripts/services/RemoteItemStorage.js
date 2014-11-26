(function (
    angular,
    RemoteStorage,
    remoteStorage) {

    'use strict';

    angular.module('webwalletApp').factory('RemoteItemStorage', function (
            config,
            BaseItemStorage) {

        function RemoteItemStorage(version, keyItems, keyVersion, path) {
            BaseItemStorage.call(this, version, keyItems, keyVersion);

            this._path = path;
        }

        RemoteItemStorage.prototype = Object.create(BaseItemStorage.prototype);
        RemoteItemStorage.prototype.constructor = RemoteItemStorage;

        RemoteItemStorage.prototype.RS_MODULE = 'mytrezor.com';
        RemoteItemStorage.prototype.RS_TYPE = 'value';

        RemoteItemStorage.prototype._path = null;

        RemoteItemStorage.prototype._connect = function (callback) {
            if (!remoteStorage[this.RS_MODULE]) {
                RemoteStorage.defineModule(this.RS_MODULE,
                        function (privateClient) {

                    privateClient.declareType(this.RS_TYPE, {
                        type: 'object',
                    });

                    return {
                        exports: {
                            _client: privateClient
                        }
                    };
                }.bind(this));

                remoteStorage.backend = 'dropbox';
                remoteStorage.setApiKeys('dropbox', {
                  api_key: config.dropboxApiKey
                });
                remoteStorage.access.claim(this.RS_MODULE, 'rw');
                remoteStorage.displayWidget();
            }
            callback(remoteStorage[this.RS_MODULE]._client);
        };

        RemoteItemStorage.prototype.get = function (path, callback) {
            this._connect(function (client) {
                this._get(client, path, callback);
            }.bind(this));
        };

        RemoteItemStorage.prototype._get = function (client, path, callback) {
            if (path[path.length - 1] === '/') {
                client.getAll(path, false)
                    .then(function (objects) {
                        var key,
                            ret = {};
                        for (key in objects) {
                            if (objects.hasOwnProperty(key)) {
                                ret[key] = objects[key].value;
                            }
                        }
                        console.log('[remoteStorage] get all', path, objects);
                        callback(ret);
                    }.bind(this), function (err) {
                        console.warn('[remoteStorage] get all', path, err);
                        callback(null);
                    });
                return;
            } else {
                client.getObject(path, false)
                    .then(function (object) {
                        if (object) {
                            console.log('[remoteStorage] get', path,
                                object.value);
                            callback(object.value);
                        } else {
                            console.warn('[remoteStorage] get', path, object);
                            callback(object);
                        }
                    });
            }
        };

        RemoteItemStorage.prototype.set = function (path, val) {
            this._connect(function (client) {
                this._set(client, path, val);
            }.bind(this));
        };

        RemoteItemStorage.prototype._set = function (client, path, val) {
            var key;
            if (path[path.length - 1] === '/' && typeof val === 'object') {
                for (key in val) {
                    if (val.hasOwnProperty(key)) {
                        this._set(
                            client,
                            path + key,
                            val[key]
                        );
                    }
                }
            } else {
                this._setKey(client, path, val);
            }
        };

        RemoteItemStorage.prototype._setKey = function (client, path, val) {
            console.log('[remoteStorage] set', path, val);
            client.storeObject(
                this.RS_TYPE,
                path,
                {value: val}
            );
        };

        RemoteItemStorage.prototype.watch = function (objects) {
            this._connect(function (client) {
                this._watch(client, objects);
            }.bind(this));
        };

        RemoteItemStorage.prototype._watch = function (client, objects) {
            return; // DEBUG

            client.on('change', function (e) {
                var pos,
                    keys,
                    i,
                    l,
                    cur;
                if (e.origin === 'remote' || e.origin === 'conflict') {
                    console.log('[remoteStorage] change', e, this._keyItems);
                    pos = e.path.indexOf(this._keyItems);
                    if (pos === 0 && pos !== e.path.length) {
                        keys = e.path.slice(pos + 1);
                        console.log(e, this._keyItems, keys);
                        keys.split('/');
                        cur = objects;
                        for (i = 0, l = keys.length; i < l; i = i + 1) {
                            cur = cur[i];
                        }
                        // TODO Resolve conflicts
                        cur = e.newValue;
                    }
                }
            }.bind(this));
        };

        return RemoteItemStorage;
    });

}(
    this.angular,
    this.RemoteStorage,
    this.remoteStorage));
