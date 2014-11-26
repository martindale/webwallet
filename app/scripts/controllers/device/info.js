/*global angular*/

angular.module('webwalletApp').controller('DeviceInfoCtrl', function (
    $scope) {

    'use strict';

    $scope.highlightedXpub = null;

    $scope.highlightXpub = function (xpub) {
        $scope.highlightedXpub = xpub;
    };

});
