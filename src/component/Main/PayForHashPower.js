import React, { Component } from 'react';
import $ from 'jquery';
import QRCode from "react-qr-code";

import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';

import { unAuthorize } from './../../redux/action/AuthAct';
import {  engageApp } from './../../redux/action/PageAct';
import { probeUserPayment, fetchWalletAddressToPayTo } from './../../redux/action/PurchaseAct';

import { connect } from 'react-redux';


class PayForHashPower extends Component{


    constructor(props){
        super(props);


        this.state = {
            amount: 0,
            paymentState : false,
            address: "",
            loadingPaymentSetUp: true,
        }

        this.setUpWalletTagToReceivePayment = this.setUpWalletTagToReceivePayment.bind(this);
        this.probePayment = this.probePayment.bind(this);
    }

    componentDidMount(){
        
        if(typeof this.props.coinSelected.ref === "undefined"){
            this.props.history.push('/start-mining');
            return;
        }

        $('#bodyClick').trigger('click');
        window.scrollTo(0, 0); 

        const hashPwr = this.props.hashPowerToPurchase.h;
        const addr = this.props.hashPowerToPurchase.ad; 
        const amount = hashPwr / this.props.coinSelected.exchangeRateToHashPower;
        if( amount > 0){
            this.setState({amount});
            if(addr === undefined){
                this.setUpWalletTagToReceivePayment(amount);
            }else{
                this.setState({ address: addr, loadingPaymentSetUp: false});
            }
        }else{
            this.props.history.push('/dashboard');
            return;
        }
 
    }

    setUpWalletTagToReceivePayment = async (expectedAmount) => {
        try{

            //fetch address from server
            await this.props.fetchWalletAddressToPayTo( this.props.coinSelected.currency, expectedAmount );
            
            const serverRes = this.props.walletAddressToPayTo;

            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }

            this.setState({ address: serverRes.data.address});
        
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
            this.setState({loadingPaymentSetUp: false});
        }
    }

    probePayment = async () => {
        try{
            //fetch probe server from server
            this.props.engageApp(true);
            await this.props.probeUserPayment(this.props.coinSelected.currency, this.state.address);
            const serverRes = this.props.paymentReceipt;
            // console.log(serverRes);

            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data }
            }

            
            if(serverRes.data.paymentStatus == true){
               alert("Payment approved");
               this.props.history.push("/contracts"); 
            }else{
                toastr.error("No payment received yet");
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

    render(){
        return (
            <>

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

                    <div className="col-12 mb-4">

                        <h2 className="text-center">
                            <b> Pay </b><hr className="my-1" style={ {width: "2.5rem", borderBottom: "4px solid #283593"} }/>
                        </h2>

                    </div>


                    <div className="col-xs-12 col-sm-12 col-md-6 mx-auto mb-2">
                        <div className="py-3 white round">
                      
                            <div className="row">
                                
                                <div className="col-12 text-center">
                                    {
                                        this.state.address.length > 0 ?
                                            <>                                          
                                                <QRCode value={this.state.address.trim()} /><br /><br />
                                                <p style={{wordWrap: "break-word"}}>{this.state.address.trim()}</p>
                                            </>
                                        :
                                            <p className="d-block w-100 text-center">
                                                <img src="/svg/Loader.svg" width="20%"/><br />
                                                <b>  Waiting on payment address </b>
                                            </p>
                                    }
                                </div>
                                
                                <form className="col-12 mt-3">
                                    
                                    <div className="form-group">
                                        <label>{this.props.coinSelected.currency}</label>
                                        <input type="text" required value={this.state.amount} readOnly={true} placeholder="Crypto value" className="form-control" />
                                    </div>

                                </form>
                            </div>
                      
                            <div className="row p-2 my-3">
                                <div className="col-12 my-1"> 
                                    <button type="button" disabled={this.props.appEngaged || this.state.address.length == 0} onClick={this.probePayment} className="btn btn-round btn-danger btn-block">
                                        { this.props.appEngaged ? 'Checking' : 'I have paid '+this.state.amount+ ""+this.props.coinSelected.currency }
                                    </button>
                                </div>
                            </div>
                      
                        </div>
                    </div>
                </div>
            </div>

             {/* Loading Dashboard modal */}
             {
                this.state.loadingPaymentSetUp 
                ?
                    <div className="fade" style={ {position: "fixed", top: "0", left: "0", backgroundColor: "#000000", opacity: "0.8", height: "100%", width: "100%", overflowY: "no-scroll" } } id="noticeModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-notice">
                            <div className="modal-content mt-4" style={ {backgroundColor: "#ffffff !important"} }>
                                <div className="modal-header no-border-header">
                                    {/* <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                    <h5 className="modal-title" id="myModalLabel">How Do You Become an Affiliate?</h5> */}
                                </div>
                                <div className="modal-body">
                                    <div className="instruction">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <p className="text-center"> Setting payment environment </p>
                                                <div className="progress">
                                                    <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={ { width: "100%" } }></div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            
                            </div>
                        </div>
                    </div>
                :
                    null

            }

            </>
        );
    }
}


const mapStateToProps = (state) => {
    console.log(state);
    return {
        appEngaged: state.appEngaged,
        paymentReceipt: state.paymentReceipt,
        walletAddressToPayTo: state.walletAddressToPayTo,
        coinSelected: state.coinSelected,
        hashPowerToPurchase: state.hashPowerToPurchase,
    };
}

export default connect(mapStateToProps, {  probeUserPayment, fetchWalletAddressToPayTo, engageApp, unAuthorize })(PayForHashPower);