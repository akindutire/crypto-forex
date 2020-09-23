import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';

import $ from 'jquery';


import { register } from './../../redux/action/AuthAct';
import { navShouldBeTransapent, engageApp } from './../../redux/action/PageAct';

class Register extends Component{

    
    constructor(props){
        super(props);

        this.state = {
            name: "",
            email: "",
            password: "",
            confirm_password: ""
        }
    
        this.register = this.register.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);

    }

    register = async () => {
        try{
            
            let referralKey = "00";
            if(typeof this.props.match.params.referral != "undefined" && this.props.match.params.referral.trim().length != 0){
                referralKey = this.props.match.params.referral;
            }
           
            //Hit the server
            this.props.engageApp(true);
            
            if(this.state.password.trim().length < 1){
                throw { status: 400, message: "Password is empty"};
            }

            if(this.state.confirm_password.trim().length < 1){
                throw { status: 400, message: "Password confirmation is empty"};
            }

            if(this.state.password !== this.state.confirm_password){
                throw { status: 400, message: "Password not confirmed"};
            }
            
            await this.props.register({name: this.state.name, email: this.state.email, password: this.state.password, confirmPassword:this.state.confirm_password, referralUserKey: referralKey});
        
            const serverRes = this.props.registrationReceipt;
        
            if(serverRes.status !== 200 ){
                throw { status: serverRes.status, message: serverRes.data  }
            }
 
            toastr.success(serverRes.data.message);
            this.setState({name: "", password: "", email:"", confirm_password: ""});
        
        }catch(e){
          
            if(typeof e.message == "object" || e.status === 401 || e.status === 403){
                toastr.error(e.message.message); 
            }else{
                toastr.error(e.message);
            }
        }finally{
            await this.props.engageApp(false);
        }
    }

    handleFormChange(e){
        this.setState({ [e.target.name] : e.target.value });
    }


    componentDidMount(){
        // this.props.navShouldBeTransapent();
        $('#bodyClick').click();
        window.scrollTo(0, 0);
    }

    render(){
        return (
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
                    <div className="page-header" style={ {maxHeight: "unset", backgroundImage: "url('/img/sections/register.jpg')" } }>
                        <div className="filter"></div>
                        <div className="container">
                            <div className="row" style={ {marginTop: "10rem" } }>
                                <div className="col-lg-6 col-md-6 col-sm-7 col-12 ml-auto">
                                    <div className="info info-horizontal" style={ { padding: "0" } }>
                                        <div className="icon">
                                            <i className="fa fa-umbrella"></i>
                                        </div>
                                        <div className="description">
                                            <h3> We've got you covered </h3>
                                            <p>Different security measures are in place to protect your account and also, to help you recover your password easily.</p>
                                        </div>
                                    </div>
                                    <div className="info info-horizontal">
                                        <div className="icon">
                                            <i className="fa fa-map-signs"></i>
                                        </div>
                                        <div className="description">
                                            <h3> Steady coin growth </h3>
                                            <p>Get the most benefit from both trading and mining rewards. The more you invest, the more the profit.</p>
                                        </div>
                                    </div>
                                    <div className="info info-horizontal">
                                        <div className="icon">
                                            <i className="fa fa-user-secret"></i>
                                        </div>
                                        <div className="description">
                                            <h3> Secured Deposit and Withdrawal </h3>
                                            <p>Activate your 2fa for a more secured deposit and instant withdrawal status.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-5 col-12 mr-auto">
                                    <div className="card card-register" style={ {background: "#303f9f "} }>
                                        <h3 className="card-title text-center text-light">Register</h3>
                                      
                                        <form className="register-form mb-4">

                                            <input type="text" name="name" value={this.state.name} onChange={this.handleFormChange} className="form-control my-3" placeholder="Name" required />

                                            <input type="email" name="email" value={this.state.email} onChange={this.handleFormChange} className="form-control my-3" placeholder="Email" required />

                                            <input type="password" name="password" value={this.state.password} onChange={this.handleFormChange} className="form-control my-3" placeholder="Password" required />

                                            <input type="password" name="confirm_password" value={this.state.confirm_password} onChange={this.handleFormChange}  className="form-control my-3" placeholder="Confirm Password" required />

                                            <button disabled={this.props.appEngaged} onClick={this.register} className="btn btn-block btn-round my-3 bg-light" style={ {background: "#ffffff", color: "#303f9f", borderColor: "#ffffff"} }>
                                                { this.props.appEngaged ? 'Processing' : 'Register' }
                                            </button>

                                        </form>
                                        <div className="login">
                                            <p>Already have an account? <Link style={ {color: "#90caf9"} } to="/login">Log in</Link></p>
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
        registrationReceipt: state.registrationReceipt,
        shouldNavBeTransparent: state.shouldNavBeTransparent,
        appEngaged: state.appEngaged,
    }
}

export default connect(mapStateToProps,{engageApp, navShouldBeTransapent, register})(Register);