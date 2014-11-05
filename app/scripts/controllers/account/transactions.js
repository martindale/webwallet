/*global angular */

angular.module('webwalletApp').controller('AccountTransactionsCtrl', function (
    metadata,
    $scope) {

    'use strict';

    /**
     * TODO
     */
    $scope.saveAddressLabel = function (tx) {
        // console.log('$scope.saveAddressLabel', tx);
        metadata.setAddressLabel(
            tx.analysis.addr.toString(),
            tx._label
        );
    };

});
