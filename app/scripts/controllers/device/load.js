/*global angular*/

angular.module('webwalletApp').controller('DeviceLoadCtrl', function (
    flash,
    deviceService,
    $scope) {

    'use strict';

    $scope.settings = {
        pin_protection: true
    };

    $scope.loadDevice = function () {
        var set = $scope.settings,
            dev = $scope.device;

        if (set.label)
            set.label = set.label.trim();
        set.payload = set.payload.trim();

        dev.load(set).then(
            function () {
                deviceService.navigateToDevice(dev);
            },
            function (err) {
                flash.error(err.message || 'Importing failed');
            }
        );
    };

});
