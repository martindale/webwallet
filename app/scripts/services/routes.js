/*global angular*/

angular.module('webwalletApp').service('routes', function (
    $q,
    $location,
    $rootScope,
    routesSearch) {

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
            this._redirectWithSearch(path);
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
            this._redirectWithSearch(path).replace();
        },

        /**
         * TODO
         */
        home: function () {
            this._redirectWithSearch('/');
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
        _redirectWithSearch: function (path) {
            console.log('[routes] go to', path, routesSearch);
            if (routesSearch) {
                return $location.path(path + '?_&' + routesSearch);
            }
            return $location.path(path);
        }
    };

    return Routes;

});
