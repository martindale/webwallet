/*global angular */

angular.module('webwalletApp').controller('AccountReceiveCtrl', function (
    metadata,
    $document,
    $scope,
    $timeout) {

    'use strict';

    $scope.LOOK_AHEAD = 20;

    $scope.activeAddress = null;
    $scope.usedAddresses = [];
    $scope.addresses = [];
    $scope.labelsChanged = false;

    $scope.activate = function (addrObj) {
        $scope.activeAddress = addrObj;

        /*
         * Select the address text.
         *
         * Depends on HTML class `js-address`.
         */
        $timeout(function () {
            var elem = $document.find(
                    '.js-address:contains(' + addrObj.address + ')'
                );
            if (elem.length) {
                selectRange(elem[0]);
            }
        });
    };

    $scope.more = function () {
        var index = $scope.addresses.length,
            address = $scope.account.address(index),
            addrObj = {
                address: address.address,
                index: address.path[address.path.length - 1],
                label: metadata.getAddressLabel(address.address),
            };
        $scope.addresses[index] = addrObj;
        $scope.activate(addrObj);
    };

    $scope.more();

    $scope.getUsedAddresses = function () {
        var usedAddresses = [],
            usedAddressesRaw = $scope.account.usedAddresses(),
            address,
            i,
            l;
        for (i = 0, l = usedAddressesRaw.length; i < l; i = i + 1) {
            address = usedAddressesRaw[i];
            usedAddresses.push({
                address: address.address,
                index: address.path[address.path.length - 1],
                label: metadata.getAddressLabel(address.address)
            });
        }
        $scope.usedAddresses = usedAddresses;
    };

    function selectRange(elem) {
        var selection, range,
            document = window.document,
            body = document.body;

        if (body.createTextRange) { // ms
            range = body.createTextRange();
            range.moveToElementText(elem);
            range.select();
            return;
        }

        if (window.getSelection) { // moz, opera, webkit
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(elem);
            selection.removeAllRanges();
            selection.addRange(range);
            return;
        }
    }

    /**
     * TODO
     */
    $scope.changeAddressLabel = function (addrObj) {
        $scope.labelsChanged = true;
        metadata.setAddressLabel(
            addrObj.address,
            addrObj.label
        );
    };

    /**
     * TODO
     */
    $scope.saveAddressLabels = function () {
        metadata.save();
        $scope.labelsChanged = false;
    };

});
