/*global angular*/

angular.module('webwalletApp').controller('DeviceRecoveryCtrl', function (
    bip39,
    flash,
    deviceService,
    $scope) {

    'use strict';

    $scope.seedFocus = false;
    $scope.seedWord = '';
    $scope.seedWords = [];
    $scope.seedWordlist = bip39.english;
    $scope.settings = {
        pin_protection: true
    };

    $scope.$on('device.word', promptWord);

    $scope.startsWith = function (state, viewValue) {
        var prefix = state.substr(0, viewValue.length).toLowerCase();
        return prefix === viewValue.toLowerCase();
    };

    $scope.recoverDevice = function () {
        if ($scope.settings.label)
            $scope.settings.label = $scope.settings.label.trim();

        $scope.recovering = true;
        $scope.device.recover($scope.settings).then(
            function () {
                $scope.recovering = false;
                deviceService.navigateToDevice($scope.device);
            },
            function (err) {
                $scope.recovering = false;
                flash.error(err.message || 'Recovery failed');
            }
        );
    };

    $scope.recoverWord = function () {
        $scope.seedWords.push($scope.seedWord);
        $scope.wordCallback($scope.seedWord);
    };

    function promptWord(event, dev, callback) {
        if (dev.id !== $scope.device.id)
            return;

        $scope.seedFocus = true;
        $scope.seedWord = '';
        $scope.wordCallback = function (word) {
            $scope.seedFocus = false;
            $scope.wordCallback = null;
            $scope.seedWord = '';
            callback(null, word);
        };
    }

});
