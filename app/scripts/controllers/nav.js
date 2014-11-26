/*global angular*/

/**
 * Navigation Controller
 *
 * Manage device and account navigation and account adding.
 *
 * @see  nav.html
 */
angular.module('webwalletApp').controller('NavCtrl', function (
    deviceList,
    deviceService,
    flash,
    routes,
    $scope) {

    'use strict';

    $scope.devices = function () {
        return deviceList.all();
    };

    $scope.isActive = function (path) {
        return routes.isUrlActive(path);
    };

    $scope.addingInProgress = false;

    $scope.addAccount = function (dev) {
        $scope.addingInProgress = true;
        dev.addAccount().then(
            function (acc) {
                deviceService.navigateToAccount(dev, acc);
                $scope.addingInProgress = false;
            },
            function (err) {
                flash.error(err.message || 'Failed to add account.');
            }
        );
    };

    $scope.accountLink = function (dev, acc) {
        var link = '#/device/' + dev.id + '/account/' + acc.id; // FIXME
        if ($scope.isActive('/receive$')) link += '/receive';
        if ($scope.isActive('/send$')) link += '/send';
        return link;
    };

    $scope.forget = function (dev) {
        deviceList.forget(dev);
    };

});
