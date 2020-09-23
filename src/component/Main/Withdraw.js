import React, { Component } from 'react';
import ReduxToastr from 'react-redux-toastr';
import QRCode from "react-qr-code";
import $ from 'jquery';

import { toastr } from 'react-redux-toastr';

import { unAuthorize, getProfile } from './../../redux/action/AuthAct';
import { selectAWalletFold } from '../../redux/action/CoinAct';
import { footerShouldBeFixed, navShouldBeTransapent, engageApp } from './../../redux/action/PageAct';
import { withdraw } from './../../redux/action/WithdrawAct';

import { connect } from 'react-redux';
import axios from 'axios';

class Withdraw extends Component {

    cancelToken = axios.CancelToken;
    source = this.cancelToken.source();

    //Minimum amounts
    withdrawalLimits = {
        BTC: 0.00046,
        ETH: 0.014,
        LTC: 0.10,
        DOGE: 1808,
        ZEC: 0.09,
        DASH: 755
    };

    constructor(props) {
        super(props);

        this.state = {
            amount: 0.0000,
            available_bal: 0.00,
            address: "",
            m_address: "",
            readyToWithdraw: false,
        };

        this.handleWithdrawal = this.handleWithdrawal.bind(this);
        
    }

    handleWithdrawal = async () => {
        try{

            if(this.state.amount < this.withdrawalLimits[this.props.coinSelected.currency]){
                throw {status: 400, message: "Minimum amount withdrawable has been exceeded"};
            }

            if(this.state.amount > 0 ){

                if(this.state.address.trim().length < 1){
                    throw { status: 400, message: "Address not defined"};
                }

                this.props.engageApp(true);

                const data = {amount: this.state.amount, address: this.state.address, currency: this.props.coinSelected.currency};
                await this.props.withdraw(data);
                const serverRes = this.props.withdrawalReceipt;
                if(serverRes.status !== 200){
                    throw { status: serverRes.status, message: serverRes.data  }
                }
                this.props.history.push("/transactions");
        
            }else{
                throw { status: 400, message: "Amount must be greater than 0"};
            }


        }catch(e){
            if(typeof e.message == "object" || e.status === 401 || e.status === 403){
                if(e.status === 401 || e.status === 403){
                    this.props.unAuthorize();
                }else{
                    toastr.error(e.message.message); 
                }
            }else{
                toastr.error(e.message);
            }
        }finally{
            this.props.engageApp(false);
        }
    }

    async componentDidMount() {

        $('#bodyClick').trigger('click');
        window.scrollTo(0, 0);

        try{
            if(typeof this.props.coinSelected.ref === "undefined"){
                this.props.history.push('/start-mining');
                return;
            }else{
                if( this.props.coinSelected.coinRates !== undefined ){
                    this.setState({rates: this.props.coinSelected.coinRates, cur_coin: this.props.coinSelected});
                }else{
                    alert("No rates found to this dashbaord, contact admin");
                    this.props.history.push('/start-mining');
                }
            }

            await this.props.getProfile();
            let serverRes = this.props.currentUserProfile;
            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
            this.setState({address: serverRes.data.data.withdrawalAddress});

            await this.props.selectAWalletFold(this.props.coinSelected.currency, this.source.token);
            serverRes = this.props.walletFoldForACurrency;
            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
            this.setState({available_bal: serverRes.data.data.balance});
        
        }catch(e){
            if(typeof e.message == "object" || e.status === 401 || e.status === 403){
                if(e.status === 401 || e.status === 403){
                    this.props.unAuthorize();
                }else{
                    toastr.error(e.message.message); 
                }
            }else{
                toastr.error(e.message);
            }
        }finally{
            this.props.engageApp(false);
        }
    }

    componentWillUnmount(){
        this.source.cancel();
    }

    render() {
        return (
            <div className="container">
                <ReduxToastr
                    timeOut={10000}
                    newestOnTop={false}
                    preventDuplicates
                    position="top-right"
                    getState={(state) => state.toastr} // This is the default
                    transitionIn="bounceIn"
                    transitionOut="bounceOut"
                    progressBar={false}
                    closeOnToastrClick />

                <div className="row" style={{ marginTop: "4.5rem", paddingBottom: "4.5rem", height: "auto", minHeight: "550px" }}>

                    <div className="col-12 my-3">

                        <h2 className="text-center">
                            <b> Withdraw </b><hr className="my-1" style={ {width: "2.5rem", borderBottom: "4px solid #283593"} }/>
                        </h2>

                    </div>


                    <div className="col-xs-12 col-sm-12 col-md-6 mx-auto mb-2">
                        <div className="py-3 white round">
                            {
                                !this.state.readyToWithdraw ?
                                    <>
                                        <div className="row">
                                            <form className="col-12 mt-3">

                                                <div className="form-group">
                                                    <label>Amount</label>
                                                    <input type="number" step="0.00000001" min="0" value={this.state.amount} onChange={(e) => this.setState({ amount: parseFloat(e.target.value) })} placeholder="Amount" className="form-control" />
                                                </div>

                                            </form>
                                        </div>

                                        <div className="row p-2">
                                            <div className="d-block mx-auto text-center">
                                                <span>Available balance:</span>
                                                <span className="ml-2"><b>{this.state.available_bal}</b> <span className="text-success">{this.props.coinSelected.currency}</span></span><br />
                                                <span>Withdrawal process time is from instant to 48 hours</span><br />
                                                <span>Minimum withdrawal: <b>{this.withdrawalLimits[this.props.coinSelected.currency]}</b> <b className="text-success">{this.props.coinSelected.currency}</b></span>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="row p-3">
                                            <div className="col-12 text-center">
                                                <QRCode value={this.state.address} />
                                            </div>
                                        </div>

                                        <div className="row p-2">
                                            <div className="d-block mx-auto">

                                                <span className="text-center">
                                                    <b>{this.state.address}</b> <br /><br />
                                                    <b>{this.state.amount}</b> {this.props.coinSelected.currency} <br /><br />

                                                    <span data-toggle="modal" data-target="#changeAddressModal" style={{ cursor: "pointer", display: this.props.appEngaged ? 'none' : 'block' }} className="badge badge-danger">
                                                        <i className="fas fa-exchange-alt"></i> Change/Add Address
                                                    </span>

                                                </span>
                                            </div>
                                        </div>

                                    </>

                            }

                            {

                                !this.state.readyToWithdraw ?

                                    <div className="row p-2 my-3">
                                        <div className="col-12 my-1"> <button onClick={() => { this.state.available_bal - this.state.amount >= 0 ? this.setState({ readyToWithdraw: !this.state.readyToWithdraw }) : toastr.error("Error: Insufficient fund"); }} className="btn btn-round btn-danger btn-block">Withdraw</button></div>
                                    </div>
                                    :
                                    <>
                                        <div className="row p-2 my-3">

                                            <div className="col-12 col-sm-12 col-md-6 my-1"> 
                                                <button className="btn btn-round btn-warning btn-block" disabled={this.props.appEngaged} onClick={() => { this.setState({ readyToWithdraw: !this.state.readyToWithdraw }) }} > 
                                                    <i className="fas fa-arrow-left"></i> Go back
                                                </button></div>

                                            <div className="col-12 col-sm-12 col-md-6 my-1"> 
                                                <button disabled={this.props.appEngaged || this.state.address.length == 0 } onClick={this.handleWithdrawal} className="btn btn-round btn-danger btn-block">
                                                    { this.props.appEngaged ? 'Processing' : 'Complete' }
                                                </button>
                                            </div>
                                        </div>
                                    </>

                            }
                        </div>
                    </div>
                </div>


                {/* Change address modal */}

                <div  className="modal fade" id="changeAddressModal" tabIndex="-1" role="dialog" aria-hidden="false">
                    <div className="modal-dialog modal-register">
                        <div className="modal-content">
                            <div className="modal-header no-border-header text-center">
                                <button type="button" className="close" data-dismiss="modal" id="closeChangeAddrModal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h6 className="text-muted">Address to withdraw to</h6>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Address</label>
                                    <input type="text" id="newAddrInput" value={this.m_address} onChange={(e) => { this.setState({ m_address: e.target.value }) }} placeholder="Address" className="form-control" />
                                </div>

                                <button
                                    disabled={this.state.m_address.trim().length < 1} className="btn btn-block btn-round btn-danger" onClick={() => { this.setState({ address: this.state.m_address.trim(), m_address: "" }); $('#closeChangeAddrModal').trigger('click'); $('#newAddrInput').val('');  }}> <i className="fas fa-check mr-1"></i> Done </button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}

const mapStateToProps = (state) => {
    // console.log(state);
    return {
        withdrawalReceipt: state.withdrawalReceipt,
        appEngaged: state.appEngaged,
        currentUserProfile: state.currentUserProfile,
        walletFoldForACurrency: state.walletFoldForACurrency,
        coinSelected: state.coinSelected,
    };
}

export default connect(mapStateToProps, { footerShouldBeFixed, navShouldBeTransapent, withdraw, engageApp, unAuthorize, getProfile, selectAWalletFold })(Withdraw);