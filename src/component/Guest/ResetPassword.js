import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import $ from 'jquery';

import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';

import { navShouldBeTransapent, engageApp } from './../../redux/action/PageAct';
import { resetPassword } from './../../redux/action/AuthAct';

class ResetPassword extends Component{

    constructor(props){
        super(props);

        this.state = {
            password: "",
            confirm_password: ""
        }

        this.resetPassword = this.resetPassword.bind(this);
    }

    resetPassword = async () => { 
        try{
 

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

            await this.props.resetPassword({resetToken: this.props.match.params.token, password: this.state.password, confirmPassword:this.state.confirm_password});
            
            const serverRes = this.props.resetPasswordPasswordReceipt;

            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
 
            toastr.success(serverRes.data.message);
            this.setState({password: "", confirm_password: ""});
        
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
                                <div className="col-lg-4 col-md-6 col-sm-6 ml-auto mr-auto">
                                    <div className="card card-register" style={ {background: "#303f9f "} }>
                                        <h3 className="card-title text-light"> Reset password </h3>
                                    
                                                <form className="register-form mb-4">
                                                   
                                                    <label>Password</label>
                                                    <input type="password" name="password" value={this.state.password} onChange={ (e) => {this.setState({password: e.target.value})} } className="form-control no-border" placeholder="Password" required />

                                                    <label>Confirm Password</label>
                                                    <input type="password" name="confirm_password" value={this.state.confirm_password} onChange={ (e) => {this.setState({confirm_password: e.target.value})} } className="form-control no-border" placeholder="Password" required />

                                                    <button type="button" disabled={this.props.appEngaged} onClick={this.resetPassword} className="btn btn-danger btn-block btn-round"  style={ {background: "#ffffff", color: "#303f9f", borderColor: "#ffffff"} }>
                                                        { this.props.appEngaged ? 'Processing' : 'Reset' }
                                                    </button>
                                                </form>

                                            
                                                <div className="login">
                                                    <p className=" text-center">Already have an account? <Link to="/login" className="" style={ {color: "#90caf9"} }> Login </Link></p>
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
        resetPasswordPasswordReceipt: state.resetPasswordPasswordReceipt,
        shouldNavBeTransparent: state.shouldNavBeTransparent,
        appEngaged: state.appEngaged,
    }
}

export default connect(mapStateToProps,{ engageApp, navShouldBeTransapent, resetPassword})(ResetPassword);