import { combineReducers } from 'redux';

import { reducer as toastrReducer } from 'react-redux-toastr'
import {
    authenticationReceipt,
    mfaVerificationReceipt,
    enable2faReceipt,
    disable2faReceipt,
    authorized,
    bookedSessionForForgotPassword,
    registrationReceipt,
    resetPasswordPasswordReceipt,
    currentUserProfile
} from './AuthRdx';
import {
    shouldNavBeTransparent,
    shouldFooterBeFixed,
    appEngaged,
    contactUsReceipt,
    hashPowerToPurchase
} from './PageRdx';
import {
    withdrawalReceipt,
    walletAddressToWithdrawTo,
    coinSelected,
    minableCoin,
    walletAddressToPayTo,
    paymentReceipt,
    currencies,
    allCoinsReceipt,
    addCoinReceipt,
    aCoinReceipt,
    aCoinRateReceipt,
    editOrAddACoinRateReceipt,
    editACoinReceipt,
    toggleACoinReceipt,
    walletFoldForACurrency,
    contractForAFoldThroughCurrency,
    unfulfilledPaymentExpectation,
    contractRenewalReceipt,
    contractReleaseReceipt,
    fundMovementOutOfContractReceipt,
    fetchTransactionsReceipt,
    fetchUsersWithdrawalTransactionsReceipt,
    doApproveWithrawalRequestReceipt
} from './UserRdx';

export const reducer = combineReducers({
    toastr: toastrReducer,

    authenticationReceipt,
    enable2faReceipt,
    disable2faReceipt,
    mfaVerificationReceipt,
    authState: authorized,
    currentUserProfile,
    bookedSessionForForgotPassword,
    registrationReceipt,
    resetPasswordPasswordReceipt,
    shouldNavBeTransparent,
    shouldFooterBeFixed,
    withdrawalReceipt,
    walletAddressToWithdrawTo,
    paymentReceipt,
    walletAddressToPayTo,
    appEngaged,
    contactUsReceipt,
    coinSelected,
    currencies,
    minableCoin,
    allCoinsReceipt,
    addCoinReceipt,
    aCoinReceipt,
    aCoinRateReceipt,
    editOrAddACoinRateReceipt,
    editACoinReceipt,
    toggleACoinReceipt,
    walletFoldForACurrency,
    contractForAFoldThroughCurrency,
    hashPowerToPurchase,
    unfulfilledPaymentExpectation,
    fundMovementOutOfContractReceipt,
    contractRenewalReceipt,
    contractReleaseReceipt,
    fetchTransactionsReceipt,
    fetchUsersWithdrawalTransactionsReceipt,
    doApproveWithrawalRequestReceipt,
    
})