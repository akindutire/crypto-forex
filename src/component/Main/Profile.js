import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import $ from 'jquery';

import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';

import { unAuthorize, getProfile, bookForgotPasswordSession, enable2FA, disable2FA } from './../../redux/action/AuthAct';
import { engageApp, setHashPowerToPurchase } from './../../redux/action/PageAct';
import { fetchUnfulfilledPaymentExpectation } from './../../redux/action/PurchaseAct';
import { getAuthority } from './../../redux/service/FxApi';

import { connect } from 'react-redux';

import axios from 'axios';

class Profile extends Component {

    cancelToken = axios.CancelToken;
    source = this.cancelToken.source();

    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            profile: {
                name: "",
                email: "",
                createdAt: "",
                coinMined: "",
                contractCount: "",
                withdrawalAddress: "",
                referralKey: ""
            },
            coinedMined: 0,
            contractCounts: 0,
            unfilledPayments: [],
            cur_coin: [],
            mfa_secret: "",
            mfa_uri: ""
            
        };
     
        this.handlePurchase = this.handlePurchase.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.loadProfile = this.loadProfile.bind(this);
        this.activate2FA = this.activate2FA.bind(this);
        this.deactivate2FA = this.deactivate2FA.bind(this);
    }

    handlePurchase = async (expectedHashPower, address, meta) => {
        try{

            await this.props.setHashPowerToPurchase({h: expectedHashPower, ad: address, t: meta});
            this.props.history.push(`/pay`);

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

    handleChangePassword = async() => {
        try{
            
            //Hit the server
            this.props.engageApp(true);

            if(this.state.profile.email.trim().length < 1){
                throw { status: 400, message: "Email is empty"};
            }

            await this.props.bookForgotPasswordSession(this.state.profile.email, this.source.token);
            
            const serverRes = this.props.bookedSessionForForgotPassword;

            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
 
            toastr.success(serverRes.data.message);
            this.setState({f_email: ""});
        
        }catch(e){
            if(typeof e.message == "object"){
                toastr.error(e.message.message);
            }else{
                toastr.error(e.message);
            }
        }finally{
            this.props.engageApp(false);
        }
    }

    loadProfile = async () => {
        try{

            await this.props.getProfile(this.source.token);
            let serverRes = this.props.currentUserProfile;
            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
            this.setState({profile: serverRes.data.data, contractCounts:serverRes.data.data.contractCount[ this.props.coinSelected.currency], coinMined:serverRes.data.data.coinMined[ this.props.coinSelected.currency], mfa_secret: serverRes.data.data.secretFor2FA, mfa_uri:  serverRes.data.data.secretFor2FAUri});
    
            await this.props.fetchUnfulfilledPaymentExpectation(this.props.coinSelected.currency, this.source.token);
            serverRes = this.props.unfulfilledPaymentExpectation;
            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
            this.setState({unfilledPayments: serverRes.data.data});

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

    activate2FA = async () => {
        try{

            this.props.engageApp(true);
            await this.props.enable2FA(this.source.token);
            let serverRes = this.props.enable2faReceipt;
            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
            console.log(serverRes);
            this.loadProfile();
            this.setState({ mfa_secret: serverRes.data.data.secret, mfa_uri: serverRes.data.data.uri });
            
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

    deactivate2FA = async () => {
        try{

            this.props.engageApp(true);
            await this.props.disable2FA(this.source.token);
            let serverRes = this.props.disable2faReceipt;
            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
            console.log(serverRes);
            this.loadProfile();
            this.setState({mfa_secret: "", mfa_uri: "" });
            
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

        if(typeof this.props.coinSelected.ref === "undefined"){
            this.props.history.push('/start-mining');
            return;
        }else{
            this.setState({cur_coin: this.props.coinSelected})
        }

        this.loadProfile();
        
    }
    

    componentWillUnmount(){
        this.source.cancel();
    }

    render() {
        let refLink = 'https://crypto-forex.me/'
        refLink+=this.state.profile.referralKey;

        return (
            <>

            <div className="container">
                <ReduxToastr
                    timeOut={4000}
                    newestOnTop={false}
                    preventDuplicates
                    position="top-right"
                    getState={(state) => state.toastr} // This is the default
                    transitionIn="bounceIn"
                    transitionOut="bounceOut"
                    progressBar
                    closeOnToastrClick />

                <div className="row" style={{ marginTop: "4.5rem", paddingBottom: "4.5rem", height: "auto", minHeight: "550px" }}>

                    <div className="col-12 mb-4">

                        <h2 className="text-center">
                            <b> Profile </b><hr className="my-1" style={ {width: "2.5rem", borderBottom: "4px solid #283593"} }/>
                        </h2>

                    </div>


                    <div className="col-xs-12 col-sm-12 mb-2">
                        <div className="py-3 white round">
                      
                            <div className="row">
                                
                                <div className="col-sm-12 col-md-6 p-3">
                                    <div className="card" style={ {backgroundColor: "#ffffff"} }>
                                       
                                        <h4 className="author px-3 pt-4">
                                            <span className="float-left">{this.state.profile.name}({this.state.profile.username})</span>
                                            <span className="category-social text-info float-right">
                                            {
                                                getAuthority() === "ADMIN" ?
                                                    
                                                        <Link to="/coin-management"  className="btn btn-sm btn-round btn-warning btn-block"><i className="fas fa-user-shield fa-2x text-danger"></i></Link>
                                                    
                                                :
                                                    null
                                            }
                                            </span>
                                        </h4>
                                        <div className="clearfix"></div>
                                        
                                        <div className="card-body">
                                          
                                            <div className="card-description" style={ {color: "#000000"} }>
                                               
                                                <p className="my-2"> <span> <b>E-mail:</b></span> <span>{this.state.profile.email}</span> </p>
                                                <p className="my-2"> <span>  <b>Registered on</b></span> <span>{this.state.profile.createdAt}</span> </p>

                                                

                                                <p className="my-2"> <span>  <b>Coins mined:</b></span> <span><b>{this.state.coinMined}</b></span> <span className="text-success">{this.state.cur_coin.currency}</span> </p>
                                                <p className="my-2 mb-1"> <span>  <b>Withdrawal address:</b></span> <span><b>{this.state.profile.withdrawalAddress}</b></span> </p>

                                                <p className="my-2 text-truncate"> 
                                                    <CopyToClipboard text={refLink}
                                                    onCopy={() => toastr.info('Referral link copied')}>
                                                        <small> 
                                                            <span>{refLink}</span> 
                                                        </small>
                                                    </CopyToClipboard>
                                                </p>

                                                <div className="col-sm-12 col-md-12">
                                                    <div className="row">
                                                     
                                                            
                                                        {
                                                            this.state.profile.isUsing2FA ?
                                                                <div className="p-1 col-md-6 col-sm-12">
                                                                    <button onClick={this.deactivate2FA} style={{backgroundColor: "#e53935 ", border: "2px solid #e53935 "}} className="btn btn-sm btn-round btn-danger mt-3 btn-block">Disable 2FA</button>
                                                                </div>
                                                                :
                                                                <div className="p-1 col-md-6 col-sm-12">
                                                                    <button onClick={this.activate2FA} className="btn btn-sm btn-round btn-danger mt-3 btn-block">Enable 2FA</button>
                                                                </div>

                                                        }   

                                                        {
                                                            this.state.profile.email != undefined ?
                                                                <div className="p-1 col-md-6 col-sm-12">
                                                                    <button disabled={this.props.appEngaged} onClick={this.handleChangePassword} className="btn btn-sm btn-round btn-danger mt-3 btn-block">Change Password</button>
                                                                </div>
                                                            :
                                                                null
                                                        }
                                                        

                                                    </div>
                                                        {
                                                            this.state.mfa_secret != null && typeof this.state.mfa_secret != "undefined" && this.state.mfa_secret.length > 0 
                                                            ?
                                                                <div className="row">
                                                                    <div className="col-12 mx-auto">
                                                                        <div className="d-block">
                                                                            <div className="text-center">
                                                                                <img src={this.state.mfa_uri} />
                                                                            </div>
                                                                            <p className="text-center">
                                                                                <CopyToClipboard text={this.state.mfa_secret}
                                                                                onCopy={() => toastr.info('2FA Secret copied')}>
                                                                                    <small> 
                                                                                        <span>{this.state.mfa_secret}</span> <br />
                                                                                        <span>- Copy the above or Scan the QR and add it to your MFA apps such as Google Authenticator</span>
                                                                                    </small>
                                                                                </CopyToClipboard>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            :
                                                            null
                                                        }
                                                </div>
                                            </div>
                                           
                                                
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-12 col-md-6 p-3">
                                    <div className="card d-block" style={ {backgroundColor: "#e8eaf6"} }>
                                        <div className="card-body">
                                          
                                            <div className="card-description text-center" style={{color: "#000000"}}>
                                                <h1>{this.state.contractCounts }</h1>
                                                <h4 className="text-truncate">Contract{this.state.contractCounts > 1 ? 's' : ''}</h4>
                                            </div>
                                            
                                            <div className="row">
                                    
                                                <div className="p-1 col-12">
                                                    <Link to="/contracts"  className="btn btn-sm btn-round btn-danger mt-3 btn-block">View {this.state.cur_coin.currency} contracts</Link>
                                                </div>

                                                {/* <div className="p-1 col-12">
                                                    <Link to="/withdraw"  className="btn btn-sm btn-round btn-success mt-3 btn-block">Withdraw</Link>
                                                </div> */}

                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-12 col-md-12">
                                    <div className="row">
                                        {
                                             this.state.unfilledPayments.length > 0 ? <h4 className="col-12 mx-auto text-center mb-4">Incomplete payments</h4> : null
 
                                        }
                                        {
                                            this.state.unfilledPayments.map( (c, i) => {
                                                
                                                return(
                                                    <div key={i} className="col-sm-12 col-md-6">
                                                        <div className="card" onClick={ () => { this.handlePurchase(c.expectedAmount * this.state.cur_coin.exchangeRateToHashPower, c.address, c.meta) } } style={ {backgroundColor: "#e8eaf6 "} }>
                                                            <div className="card-body" >
                                                                <h6 className="author float-left">
                                                                    <i className="fa fa-arrow-down text-muted"></i> {c.expectedAmount * this.state.cur_coin.exchangeRateToHashPower}{this.state.cur_coin.hashPowerUnit}
                                                                     <br /> 
                                                                     <i className="fa fa-arrow-down text-success"></i> {c.reservedAmount * this.state.cur_coin.exchangeRateToHashPower}{this.state.cur_coin.hashPowerUnit}
                                                                     
                                                                </h6>

                                                                <span className="category-social text-danger float-right">
                                                                    <i className="fa fa-circle text-muted"></i> {c.expectedAmount.toFixed(8)} <b>{c.currency}</b>
                                                                    <br />
                                                                    <i className="fa fa-circle text-success"></i> {c.reservedAmount.toFixed(8)} <b>{c.currency}</b>
                                                                </span>
                                                                <div className="clearfix"></div>
                                                                

                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            } )
                                        }
                                    </div>
                                </div>

                             

                            </div>
                      
                        </div>
                    </div>
                </div>
            </div>

        

            </>
        );
    }
}

const mapStateToProps = (state) => {
    // console.log(state);
    return {
        appEngaged: state.appEngaged,
        coinSelected: state.coinSelected,
        unfulfilledPaymentExpectation: state.unfulfilledPaymentExpectation,
        currentUserProfile: state.currentUserProfile,
        enable2faReceipt: state.enable2faReceipt,
        bookedSessionForForgotPassword: state.bookedSessionForForgotPassword,
        disable2faReceipt: state.disable2faReceipt,
    };
}

export default connect(mapStateToProps, { setHashPowerToPurchase, fetchUnfulfilledPaymentExpectation, engageApp, unAuthorize, getProfile, enable2FA, disable2FA, bookForgotPasswordSession })(Profile);