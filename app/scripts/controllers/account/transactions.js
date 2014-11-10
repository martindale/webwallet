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
     * TODO
     */
    $scope.addLabelsToTxs = function (newTxs) {
        var i,
            l,
            tx,
            addr;
        // No transactions -- return.
        if (newTxs === null) {
            txs = newTxs;
            return txs;
        }
        // Transactions didn't change.
        if (txs !== null && txs.equals(newTxs)) {
            // If labels changed, refresh them and continue.
            if (labels === null) {
                labels = metadata.getAllAddressLabels();
            // Nothing changed -- return.
            } else {
                return txs;
            }
        // Transactions changed.
        } else {
            // Refresh label list if necessary.
            if (labels === null) {
                labels = metadata.getAllAddressLabels();
            }
            // Refresh transaction list.
            txs = newTxs.slice();
        }
        // Add labels to transactions.
        for (i = 0, l = txs.length; i < l; i = i + 1) {
            tx = txs[i];
            addr = _getTxAddress(tx);
            if (labels[addr] !== null && labels[addr] !== undefined) {
                txs[i]._label = labels[addr];
            }
        }
        return txs;
    };

    /**
     * TODO
     */
    $scope.changeAddressLabel = function (tx) {
        $scope.labelsChanged = true;
        metadata.setAddressLabel(
            _getTxAddress(tx),
            tx._label
        );
        labels = null;
    };

    /**
     * TODO
     */
    $scope.saveAddressLabels = function () {
        metadata.save();
        $scope.labelsChanged = false;
    };

});
