import React, { Component } from 'react';
import { connect } from "react-redux";
import axios from 'axios';

import $ from 'jquery';

import { authenticate, authorize, bookForgotPasswordSession } from './../../redux/action/AuthAct';
import { navShouldBeTransapent, engageApp } from './../../redux/action/PageAct';

import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';

class Login extends Component{

    cancelToken = axios.CancelToken;
    source = this.cancelToken.source();

    constructor(props){
        super(props);

        this.state = {
            loginForm: true,
            email: "",
            password: "",

            f_email: ""
        }

        this.handleFormChange = this.handleFormChange.bind(this);
        this.login = this.login.bind(this);

    }

    handleFormChange(e){
        this.setState({ 
            [e.target.name] : e.target.value 
        });
    }

    async login() {

        try{

            if(this.state.email.trim().length < 1){
                throw { status: 400, message: "Email is empty"};
            }

            if(this.state.password.length < 1){
                throw { status: 400, message: "Password is empty"};
            }

            //Hit the server
            this.props.engageApp(true);
    
            await this.props.authenticate({email: this.state.email, password: this.state.password});
            
            const serverRes = this.props.authenticationReceipt;

            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
 
            if(serverRes.data.canProceedToMFA){
                //Move to MFA
                sessionStorage.setItem("$_ORG+=.*653-CR653-CRY15_FX_WJ1193339425_FX_WJT_KOTNE.98193339425$USER_AUTHENTICATED", this.state.email);
                this.props.history.push('/mfa-verification');
            }else{
                await this.props.authorize(serverRes.data.token, this.state.email, serverRes.data.authority);
                const sRA = this.props.authorized;
              
                if(sRA){
                    this.props.history.push('/start-mining');
                }else{
                    throw { status: 409, message: "Authorization failed!"};
                }
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

    handleForgotPassword = async () => {
        try{
            
            //Hit the server
            this.props.engageApp(true);

            if(this.state.f_email.trim().length < 1){
                throw { status: 400, message: "Email is empty"};
            }

            await this.props.bookForgotPasswordSession(this.state.f_email, this.source.token);
            
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
                                        <h3 className="card-title text-light"> { this.state.loginForm ? 'Welcome' : 'Forgot password' } </h3>
                                        {
                                            this.state.loginForm ? 

                                                <form className="register-form">
                                                    <label>Email</label>
                                                    <input type="email" name="email" value={this.state.email} onChange={this.handleFormChange} className="form-control no-border" placeholder="Email" required />

                                                    <label>Password</label>
                                                    <input type="password" name="password" value={this.state.password} onChange={this.handleFormChange} className="form-control no-border" placeholder="Password" required />

                                                    <button disabled={this.props.appEngaged} onClick={this.login} className="btn btn-danger btn-block btn-round"  style={ {background: "#ffffff", color: "#303f9f", borderColor: "#ffffff"} }>
                                                        { this.props.appEngaged ? 'Processing' : 'Login' }
                                                    </button>
                                                </form>

                                            :
                                                <form className="register-form">
                                                    <label>Email</label>
                                                    <input type="email" name="f_email" value={this.state.f_email} onChange={this.handleFormChange} className="form-control no-border" placeholder="Email" required />

                                                    <button type="button" disabled={this.props.appEngaged} onClick={this.handleForgotPassword} className="btn btn-danger btn-block btn-round"  style={ {background: "#ffffff", color: "#303f9f", borderColor: "#ffffff"} }>{ this.props.appEngaged ? 'Processing' : 'Submit' }</button>
                                                </form>
                                        }

                                        
                                            
                                        <div className="forgot">
                                            <button onClick={ () => { this.setState({loginForm: !this.state.loginForm}) } } className="btn btn-link btn-danger" style={ {color: "#90caf9"} }> { !this.state.loginForm ? 'Back to Login' : 'Forgot password?' }</button>
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
    return {
        bookedSessionForForgotPassword: state.bookedSessionForForgotPassword,
        authenticationReceipt: state.authenticationReceipt,
        authorized: state.authState,
        shouldNavBeTransparent: state.shouldNavBeTransparent,
        appEngaged: state.appEngaged,
    }
}

export default connect(mapStateToProps,{navShouldBeTransapent, engageApp, bookForgotPasswordSession, authenticate, authorize})(Login);
