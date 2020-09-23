import React, { Component } from 'react';
import { connect } from "react-redux";
import axios from 'axios';
import $ from 'jquery';
import { authorize, mfaVerification } from './../../redux/action/AuthAct';
import { navShouldBeTransapent, engageApp } from './../../redux/action/PageAct';

import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';

class MFAConfirmation extends Component{

    cancelToken = axios.CancelToken;
    source = this.cancelToken.source();

    constructor(props){
        super(props);

        this.state = {
            otp: "",
        }

        this.handleMFAVerification = this.handleMFAVerification.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
    }

    handleFormChange(e){
        this.setState({ 
            [e.target.name] : e.target.value 
        });
    }

    async handleMFAVerification() {

        try{
            
            const emailStored = sessionStorage.getItem("$_ORG+=.*653-CR653-CRY15_FX_WJ1193339425_FX_WJT_KOTNE.98193339425$USER_AUTHENTICATED");
            if(emailStored.trim().length < 1){
                this.props.history('/login');
            }

            if(this.state.otp.trim().length < 1){
                throw { status: 400, message: "OTP is empty"};
            }

            //Hit the server
            this.props.engageApp(true);
    
            await this.props.mfaVerification({email: emailStored, code: this.state.otp});
            
            const serverRes = this.props.mfaVerificationReceipt;

            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
 
            await this.props.authorize(serverRes.data.token, this.state.email, serverRes.data.authority);
            const sRA = this.props.authorized;
            
            if(sRA){
                this.props.history.push('/start-mining');
            }else{
                throw { status: 409, message: "Authorization failed!"};
            }
        
        
        }catch(e){
            if(typeof e.message == "object" || e.status === 401 || e.status === 403){
                toastr.error(e.message.message); 
            }else{
                toastr.error(e.message);
            }
        }finally{
            this.props.engageApp(false);
        }
    }

    componentDidMount(){
        // this.props.navShouldBeTransapent();
        $('#bodyClick').click();
        window.scrollTo(0, 0);
    }

    componentWillUnmount(){
        this.source.cancel();
    }

    render(){
        return(
            <>
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

                <div className="wrapper">
                    <div className="page-header" style={ {backgroundImage: "url('/img/sections/login.jpg')"  } }>
                        <div className="filter"></div>
                        <div className="container">
                            <div className="row" style={ {marginTop: "10rem" } }>
                                <div className="col-lg-4 col-md-6 col-sm-12 ml-auto mr-auto">
                                    <div className="card card-register" style={ {background: "#303f9f", maxWidth:"100%"} }>
                                        <h3 className="card-title text-light"> MFA </h3>
                                       

                                                <form className="register-form">
                                                    <label>OTP</label>
                                                    <input type="text" name="otp" value={this.state.otp} onChange={this.handleFormChange} className="form-control no-border" placeholder="OTP" maxLength={6} required />

                                                   

                                                    <button disabled={this.props.appEngaged} onClick={this.handleMFAVerification} className="btn btn-danger btn-block btn-round"  style={ {background: "#ffffff", color: "#303f9f", borderColor: "#ffffff"} }>
                                                        { this.props.appEngaged ? 'Processing' : 'Verify' }
                                                    </button>
                                                </form>

                                           
                                    
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
    return {
        mfaVerificationReceipt: state.mfaVerificationReceipt,
        authorized: state.authState,
        shouldNavBeTransparent: state.shouldNavBeTransparent,
        appEngaged: state.appEngaged,
    }
}

export default connect(mapStateToProps,{navShouldBeTransapent, engageApp, mfaVerification, authorize})(MFAConfirmation);
