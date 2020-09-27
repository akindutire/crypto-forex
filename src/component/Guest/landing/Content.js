import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReduxToastr from 'react-redux-toastr';

import {  engageApp, contactAdmin } from './../../../redux/action/PageAct';
import { connect } from 'react-redux';
import axios from 'axios';
import { toastr } from 'react-redux-toastr';
import { data } from 'jquery';

class Content extends Component {

    cancelToken = axios.CancelToken;
    source = this.cancelToken.source();


    constructor(props) {
        super(props);

        this.state = {
            c_subject: "",
            c_name: "",
            c_email: "",
            c_message: ""
        };

        this.handleSendMessage = this.handleSendMessage.bind(this);
    }

    handleSendMessage = async () => {
        try{
            this.props.engageApp(true);
            await this.props.contactAdmin({name: this.state.c_name, subject: this.state.c_subject, email: this.state.c_email, message: this.state.c_message});
            let serverRes = this.props.contactUsReceipt;
            if(serverRes.status !== 200){
                throw {  status: serverRes.status, message: serverRes.data  }
            }

            toastr.success(serverRes.data.message);
            this.setState({
                c_subject: "",
                c_name: "",
                c_email: "",
                c_message: ""
            });

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

    componentWillUnmount(){
        this.source.cancel();
    }


    render() {
        return (
            <>
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

            <div className="wrapper">
                <div className="section text-center landing-section" style={{ padding: "20px 0" }}>
                    <div className="container">
                        {/* <div className="row">
                            <div className="col-md-8 ml-auto mr-auto">
                                <h2 className="title">Let's talk product</h2>
                                <h5>This is the paragraph where you can write more details about your product. Keep you user engaged by providing meaningful information. Remember that by this time, the user is curious, otherwise he wouldn't scroll to get here. Add a button if you want the user to see more.</h5>
                                <br />
                                <Link to="/about" className="btn btn-danger btn-fill btn-round">See Details</Link>
                            </div>
                        </div> */}

                        <div className="row my-1">
                            <h2 className="title col-12" style={{ color: "#151f20" }}>Forex & Mining For <b>Pro's.</b><br />Prices <b>For Everyone.</b></h2>
                            <p className="col-12 mb-4" style={{ color: "#151f20" }}>Besides its privileged service, superior return, customer-centered platform features, easy and safe experience, Cyrpto Forex has the most advantageous prices in the market making mining and forex more competitive than even before. This is our way of saying "Thank You" to the ecosystem, technology, future, everyone who has the same excitement and vision as us.</p>
                            <br />

                            <div className="col-lg-12 d-flex flex-column text-center mt-5 mb-5">
                                <div className="site-plan d-flex flex-column p-2 border rounded">

                                    <div className="row m-0">
                                        <svg aria-hidden="true" focusable="false" style={ { width:"0", height:"0", position: "absolute"} }>
                                            <linearGradient id="gradient-ew" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#56BE89" />
                                            </linearGradient>
                                            <linearGradient id="gradient-ver" x1="0" y1="1">
                                                <stop offset="0%" stopColor="#fff" />
                                            </linearGradient>
                                        </svg>
                                        <div className="col-12 p-2 Forex/mining-plans">
                                            <ul className="nav nav-tabs row m-0" id="myTab" role="tablist">
                                                <li className="nav-item col-12 col-md-3 col-lg-2 p-1 d-flex ">
                                                    <a className="nav-link active d-flex all-center flex-fill" id="for-btc-tab" data-toggle="tab" href="#tab-btc" role="tab" aria-controls="tab-btc" aria-selected="true">

                                                        <span className="m-0">
                                                            BITCOIN &nbsp; <i className="fab fa-bitcoin"></i>
                                                        </span>
                                                    </a>
                                                </li>
                                                <li className="nav-item col-12 col-md-3 col-lg-2 p-1 d-flex ">
                                                    <a className="nav-link d-flex all-center flex-fill" id="for-eth-tab" data-toggle="tab" href="#tab-eth" role="tab" aria-controls="tab-eth" aria-selected="false">

                                                        <span className="m-0">
                                                            ETHEREUM &nbsp; <i className="fab fa-ethereum"></i>
                                                        </span>
                                                        
                                                    </a>
                                                </li>
                                                <li className="nav-item col-12 col-md-3 col-lg-2 p-1 d-flex ">
                                                    <a className="nav-link d-flex all-center flex-fill" id="for-ltc-tab" data-toggle="tab" href="#tab-ltc" role="tab" aria-controls="tab-ltc" aria-selected="false">

                                                        <span className="m-0">
                                                            LITECOIN
                                                        </span>
                                                    </a>
                                                </li>
                                                <li className="nav-item col-12 col-md-3 col-lg-2 p-1 d-flex ">
                                                    <a className="nav-link d-flex all-center flex-fill" id="for-bch-tab" data-toggle="tab" href="#tab-bch" role="tab" aria-controls="tab-bch" aria-selected="false">

                                                        <span className="m-0">
                                                            DASH
                                                        </span>
                                                        
                                                    </a>
                                                </li>
                                                <li className="nav-item col-12 col-md-3 col-lg-2 p-1 d-flex ">
                                                    <a className="nav-link d-flex all-center flex-fill" id="for-doge-tab" data-toggle="tab" href="#tab-doge" role="tab" aria-controls="tab-doge" aria-selected="false">

                                                        <span className="m-0">
                                                            DOGECOIN
                                                        </span>
                                                        
                                                    </a>
                                                </li>
                                                <li className="nav-item col-12 col-md-3 col-lg-2 p-1 d-flex">
                                                    <a className="nav-link d-flex all-center flex-fill" id="for-zcash-tab" data-toggle="tab" href="#tab-zcash" role="tab" aria-controls="tab-zcash" aria-selected="false">

                                                        <span className="m-0">
                                                            ZCASH
                                                        </span>
                                                        
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="col-12 p-1">
                                            <div className="tab-content" id="myTabContent">
                                                <div className="tab-pane fade show active" id="tab-btc" role="tabpanel" aria-labelledby="for-btc-tab">
                                                    <div className="row">
 
                                                        <div className="col-12 col-md-6 col-lg-4  p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Bitcoin Starter</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Starter</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>5<small className="pl-1">00</small></h1>
                                                                            <p>1 TH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Bitcoin Mining & Trading</p>
                                                                            <p className="all-center">SHA-256 Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-md-6 col-lg-4 p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Bitcoin Advanced</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Advanced</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>100<small className="pl-1">00</small></h1>
                                                                            <p>14 TH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Bitcoin Mining & Trading</p>
                                                                            <p className="all-center">SHA-256 Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-md-12 col-lg-4  p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Bitcoin Superior</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Superior</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>1,000<small className="pl-1">00</small></h1>
                                                                            <p>75 TH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Bitcoin Mining & Trading</p>
                                                                            <p className="all-center">SHA-256 Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="tab-pane fade " id="tab-eth" role="tabpanel" aria-labelledby="for-eth-tab">

                                                    <div className="row">

                                                        <div className="col-12 col-md-6 col-lg-4 p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Ethereum Starter</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Starter</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>5<small className="pl-1">00</small></h1>
                                                                            <p>6 MH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Ethereum Mining & Trading</p>
                                                                            <p className="all-center">Ethash Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-md-6 col-lg-4 p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Ethereum Advanced</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Advanced</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>100<small className="pl-1">00</small></h1>
                                                                            <p>61 MH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Ethereum Mining & Trading</p>
                                                                            <p className="all-center">SHA-256 Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-md-12 col-lg-4  p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Ethereum Superior</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Superior</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>1,000<small className="pl-1">00</small></h1>
                                                                            <p>295 MH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Bitcoin Mining & Trading</p>
                                                                            <p className="all-center">SHA-256 Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="tab-pane fade " id="tab-ltc" role="tabpanel" aria-labelledby="for-ltc-tab">

                                                    <div className="row">

                                                        <div className="col-12 col-md-6 col-lg-4 p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Litecoin Starter</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Starter</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>5<small className="pl-1">00</small></h1>
                                                                            <p>9 MH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Litecoin Mining & Trading</p>
                                                                            <p className="all-center">SHA-256 Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-md-6 col-lg-4 p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Litecoin Advanced</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Advanced</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>100<small className="pl-1">00</small></h1>
                                                                            <p>85 MH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Litecoin Mining & Trading</p>
                                                                            <p className="all-center">SHA-256 Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-md-12 col-lg-4 p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Litecoin Superior</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Superior</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>1,000<small className="pl-1">00</small></h1>
                                                                            <p>417 MH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Litecoin Mining & Trading</p>
                                                                            <p className="all-center">SHA-256 Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="tab-pane fade " id="tab-bch" role="tabpanel" aria-labelledby="for-bch-tab">

                                                    <div className="row">

                                                        <div className="col-12 col-md-6 col-lg-4 p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Dash Starter</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Starter</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>5<small className="pl-1">00</small></h1>
                                                                            <p>10,000 MH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Dash Mining & Trading</p>
                                                                            <p className="all-center">X11 Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-md-6 col-lg-4 p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Dash Advanced</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Advanced</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>100<small className="pl-1">00</small></h1>
                                                                            <p>110,000 MH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Dash Mining & Trading</p>
                                                                            <p className="all-center">X11 Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-md-12 col-lg-4 p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Dash Superior</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Superior</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>1,000<small className="pl-1">00</small></h1>
                                                                            <p>530,000 MH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Bitcoin Mining & Trading</p>
                                                                            <p className="all-center">x11 Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="tab-pane fade " id="tab-doge" role="tabpanel" aria-labelledby="for-doge-tab">
                                                    <div className="row">

                                                        <div className="col-12 col-md-6 col-lg-4 p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Doge Starter</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Starter</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>5<small className="pl-1">00</small></h1>
                                                                            <p>8 MH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Doge Mining & Trading</p>
                                                                            <p className="all-center">Scrypt Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-md-6 col-lg-4 p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Doge Advanced</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Advanced</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>100<small className="pl-1">00</small></h1>
                                                                            <p>70 MH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Doge Mining & Trading</p>
                                                                            <p className="all-center">Scrypt Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-md-12 col-lg-4  p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Doge Superior</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Superior</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>1,000<small className="pl-1">00</small></h1>
                                                                            <p>350 MH/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year Doge Mining & Trading</p>
                                                                            <p className="all-center">Scrypt Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="tab-pane fade " id="tab-zcash" role="tabpanel" aria-labelledby="for-zcash-tab">
                                                    
                                                    <div className="row">
                                                        
                                                        <div className="col-12 col-md-6 col-lg-4 p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">Zcash Starter</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Starter</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>5<small className="pl-1">00</small></h1>
                                                                            <p>50 H/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year ZCash Mining & Trading</p>
                                                                            <p className="all-center">Equihash Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-md-6 col-lg-4 p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">ZCash Advanced</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Advanced</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>100<small className="pl-1">00</small></h1>
                                                                            <p>400 H/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year ZCash Mining & Trading</p>
                                                                            <p className="all-center">Equihash Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 col-md-12 col-lg-4 p-2">
                                                            <div className="d-flex flex-column price-bg">
                                                                <div>
                                                                    <h4 className="m-0 p-4 d-flex text-center all-center">ZCash Superior</h4>
                                                                </div>

                                                                <div className="bo-box d-flex all-center p-4">
                                                                    <div className="row flex-fill">

                                                                        <div className="col-12 d-flex flex-column all-center">
                                                                            <p>Superior</p>
                                                                            <h1><small className="pr-2"><i className="fas fa-dollar-sign"></i></small>1,000<small className="pl-1">00</small></h1>
                                                                            <p>2,000 H/s</p>
                                                                            <p><b>3.5% profit daily</b></p>
                                                                        </div>

                                                                    </div>
                                                                    {/* <i className="fas fa-caret-down slide-down"></i> */}
                                                                </div>

                                                                <div>
                                                                    <div className="row min-dep mt-4 p-3 text-left">

                                                                        <div className="col-12 pb-2 d-flex flex-column text-center">
                                                                            <p className="all-center">1 Year ZCash Mining & Trading</p>
                                                                            <p className="all-center">Equihash Mining Algorithm</p>
                                                                            <p className="all-center">No Fees & Additional Costs</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row my-4">
                            <div className="col-md-3">
                                <div className="info">
                                    <div className="icon" style={{ color: "#151f20" }}>
                                        <i className="fab fa-ethereum"></i>
                                    </div>
                                    <div className="description">
                                        <h4 className="info-title">Deposit</h4>
                                        <p className="description">Choose any of our plans and invest any coin of your choice.</p>
                                        {/* <a href="#pkp" className="btn btn-link btn-danger">See more</a> */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="info">
                                    <div className="icon" style={{ color: "#151f20" }}>
                                        <i className="nc-icon nc-bulb-63"></i>
                                    </div>
                                    <div className="description">
                                        <h4 className="info-title">Grow</h4>
                                        <p>Watch your coins grow steady as you partner with us.</p>
                                        {/* <a href="#pkp" className="btn btn-link btn-danger">See more</a> */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="info">
                                    <div className="icon" style={{ color: "#151f20" }}>
                                        <i className="nc-icon nc-chart-bar-32"></i>
                                    </div>
                                    <div className="description">
                                        <h4 className="info-title">Withdraw</h4>
                                        <p>Enjoy our top notch instant and zero withdrawal fees.</p>
                                        {/* <a href="#pkp" className="btn btn-link btn-danger">See more</a> */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="info">
                                    <div className="icon" style={{ color: "#151f20" }}>
                                        <i className="nc-icon nc-sun-fog-29"></i>
                                    </div>
                                    <div className="description">
                                        <h4 className="info-title">Spend</h4>
                                        <p>Achieve your dreams of all time after withdraw.</p>
                                        {/* <a href="#pkp" className="btn btn-link btn-danger">See more</a> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="section section-dark text-center landing-section">
                    <div className="container">
                        <h2 className="title">Let's talk about us</h2>
                        <div className="row" style={{ marginTop: '3rem' }}>
                            <div className="col-md-4">
                                <div className="card card-profile card-plain">
                                    <div className="card-avatar">
                                        <a href="#avatar"><img src="./img/faces/u4.jpeg" alt="..." /></a>
                                    </div>
                                    <div className="card-body">
                                        <a href="#paper-kit">
                                            <div className="author">
                                                <h4 className="card-title">Mac Guffin</h4>
                                                <h6 className="card-category text-muted">Financial Analyst</h6>
                                            </div>
                                        </a>
                                        <p className="card-description text-center">
                                            A financial model that could predict the outcome of certain business decisions. He assists with deals and mergers in investment banks.
                                        </p>
                                    </div>
                                    <div className="card-footer text-center">
                                       
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card card-profile card-plain">
                                    <div className="card-avatar">
                                        <a href="#avatar"><img src="./img/faces/u1.jpg" alt="..." /></a>
                                    </div>
                                    <div className="card-body">
                                        <a href="#paper-kit">
                                            <div className="author">
                                                <h4 className="card-title">Fred Scott</h4>
                                                <h6 className="card-category text-muted">CEO</h6>
                                            </div>
                                        </a>
                                        <p className="card-description text-center">
                                            With years of experience in Cryptocurrency Trading and Mining. Fred Scott is a front line leader, and digital expert who has a proven track record of helping businesses increase their digital currencies. He has worked with national and international companies in a variety of luxury industries – including aerospace, automotive, fitness, fashion, food and more.

                                            Fred's dissimilar experience and approach towards Cryptocurrency Trading and Mining, adds to his agility and allows him to cross-pollinate ideas.
                                        </p>
                                    </div>
                                    <div className="card-footer text-center">
                                        <a href="https://www.facebook.com/fredscott868" target="_blank" className="btn btn-link btn-just-icon btn-twitter"><i className="fab fa-twitter"></i></a>
                                        <a href="https://twitter.com/FredSco56243010" target="_blank" className="btn btn-link btn-just-icon btn-dribbble"><i className="fab fa-twitter"></i></a>
                                        <a href="https://www.instagram.com/fredscott868" target="_blank" className="btn btn-link btn-just-icon btn-linkedin"><i className="fab fa-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card card-profile card-plain">
                                    <div className="card-avatar">
                                        <a href="#avatar"><img src="./img/faces/u2.jpeg" alt="..." /></a>
                                    </div>
                                    <div className="card-body">
                                        <a href="#paper-kit">
                                            <div className="author">
                                                <h4 className="card-title">Leslie Anderson</h4>
                                                <h6 className="card-category text-muted">Broker</h6>
                                            </div>
                                        </a>
                                        <p className="card-description text-center">
                                            He is one of our best brokers. His services are used extensively in some industries. He happens to be the best market researcher of the year.
                                        </p>
                                    </div>
                                    <div className="card-footer text-center">
                                      
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section landing-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 ml-auto mr-auto">
                                <h2 className="text-center">Keep in touch?</h2>
                                <form className="contact-form">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <label>Subject</label>
                                            <input className="form-control" name="subject" value={this.state.c_subject} onChange={(e) => this.setState({ c_subject: e.target.value })} placeholder="Subject" required={true} maxLength="255"/>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 col-sm-12">
                                            <label>Name</label>
                                            <input className="form-control" value={this.state.c_name} onChange={(e) => this.setState({ c_name: e.target.value })} placeholder="Name" required={true} maxLength="255"/>
                                        </div>
                                        <div className="col-md-6 col-sm-12">
                                            <label>Email</label>
                                            <input className="form-control" value={this.state.c_email} onChange={(e) => this.setState({ c_email: e.target.value })} placeholder="Email" required={true}/>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12 col-sm-12">
                                            <label>Message</label>
                                            <textarea className="form-control" value={this.state.c_message} onChange={(e) => this.setState({ c_message: e.target.value })} rows="4" placeholder="Tell us your thoughts and feelings..." required={true} maxLength="1000"></textarea>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-12">
                                            <button type="button" disabled={this.props.appEngaged} onClick={this.handleSendMessage} className="btn btn-danger btn-lg btn-fill btn-block">
                                                { this.props.appEngaged ? 'Sending' : 'Send Message' }
                                            </button>
                                        </div>
                                    </div>
                                </form>
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
        contactUsReceipt: state.contactUsReceipt,
    };
}

export default connect(mapStateToProps, {  engageApp, contactAdmin })(Content);