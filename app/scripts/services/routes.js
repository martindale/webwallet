/*global angular*/

angular.module('webwalletApp').service('routes', function (
    $q,
    $location,
    $rootScope) {

    'use strict';

    var Routes = {

        /**
         * Redirect to passed path.
         *
         * @param {String} path  Path to redirect to
         * @return {Promise}     Promise that is resolved after the redirection
         *                       is complete.
         */
        redirect: function (path) {
            var deferred,
                off;
            if ($location.path() === path) {
                return $q.when();
            }
            deferred = $q.defer();
            this._redirect(path);
            off = $rootScope.$on('$locationChangeSuccess', function () {
                deferred.resolve();
                off();
            });
            return deferred.promise;
        },

        /**
         * TODO
         */
        replace: function (path) {
            this._redirect(path).replace();
        },

        /**
         * TODO
         */
        home: function () {
            this._redirect('/');
        },

        /**
         * TODO
         */
        isUrlActive: function (path) {
            return $location.path().indexOf(path) === 0;
        },

        /**
         * TODO
         */
        _redirect: function (path) {
            console.log('[routes] go to', path);
            return $location.path(path);
        }
    };

    return Routes;

});
