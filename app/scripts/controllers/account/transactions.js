/*global angular */

angular.module('webwalletApp').controller('AccountTransactionsCtrl', function (
    metadata,
    $scope) {

    'use strict';

    var labels = null,
        txs = null;

    function _getTxAddress(tx) {
        return tx.analysis.addr.toString();
    }

    $scope.labelsChanged = false;

    /**
     * Add labels to transactions.
     *
     * TODO
     */
    function _doAddLabelsToTxs(txs) {
        metadata.getAllAddressLabels(function (labels) {
            var i,
                l,
                tx,
                addr;
            for (i = 0, l = txs.length; i < l; i = i + 1) {
                tx = txs[i];
                addr = _getTxAddress(tx);
                if (labels[addr] !== null && labels[addr] !== undefined) {
                    txs[i]._label = labels[addr];
                }
            }
        });
    }

    $scope.addLabelsToTxs = function (newTxs) {
        // No transactions -- return.
        if (newTxs === undefined || newTxs === null) {
            txs = newTxs;
            return txs;
        }
        if (txs === null || !txs.equals(newTxs)) {
            // Transactions changed, refresh them.
            txs = newTxs.slice();
        }
        if (labels === null) {
            // Labels changed, refresh them.
            _doAddLabelsToTxs(txs);
        }
        return txs;
    };

    $scope.changeAddressLabel = function (tx) {
        $scope.labelsChanged = true;
        metadata.setAddressLabel(
            _getTxAddress(tx),
            tx._label
        );
        labels = null;
    };

    $scope.saveAddressLabels = function () {
        metadata.save();
        $scope.labelsChanged = false;
    };

    $scope.isMetadataLoading = function () {
        return metadata.isLoading();
    };
});
