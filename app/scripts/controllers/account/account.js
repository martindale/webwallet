/*global angular */

angular.module('webwalletApp').controller('AccountCtrl', function (
    deviceService,
    $scope,
    $routeParams,
    config,
    routes,
    metadata) {

    'use strict';

    /**
     * Set current account reference to $scope and initialize metadata
     * or go to homepage.
     */
    deviceService.whenLoaded(function init() {
        $scope.account = $scope.device.account($routeParams.accountId);
        if (!$scope.account) {
            routes.home();
            return;
        }

        metadata.init($scope.device.id, $scope.account.id);
    });

    $scope.blockExplorer = config.blockExplorers[config.coin];

    $scope.hideAccount = function () {
        $scope.account.unsubscribe();
        $scope.device.hideAccount($scope.account);
        deviceService.navigateToAccount(
            $scope.device,
            $scope.device.accounts[$scope.device.accounts.length - 1]
        );
    };

});
