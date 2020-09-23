import React, { Component } from 'react';
import QRCode from "react-qr-code";
import $ from 'jquery';
import axios from 'axios';

import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';

import { unAuthorize } from './../../redux/action/AuthAct';
import {  engageApp } from './../../redux/action/PageAct';
import { getWithdrawals, doApproveWithrawalRequest } from './../../redux/action/TransactionAct';

import { connect } from 'react-redux';


class WithdrawaRequests extends Component{

    cancelToken = axios.CancelToken;
    source = this.cancelToken.source();

    constructor(props){
        super(props);


        this.state = {
           
            payToOnWithdraw: "",
            rates: [],
            transactions: [],
            cur_tnx_in_view: [],
            cur_coin: [],
            loadingTransactions: true,
        
          
        }

        this.loadTransactions = this.loadTransactions.bind(this);
        this.handleWithdrawApproval = this.handleWithdrawApproval.bind(this);
    
    }

    componentDidMount(){
        
        if(typeof this.props.coinSelected.ref === "undefined"){
            this.props.history.push('/start-mining');
            return;
        }else{
            this.setState({rates: this.props.coinSelected.coinRates, cur_coin: this.props.coinSelected});
        }

        $('#bodyClick').trigger('click');
        window.scrollTo(0, 0);

       this.loadTransactions();
    }

    loadTransactions = async () => {
        try{
            this.props.engageApp(true);
            await this.props.getWithdrawals(this.props.coinSelected.currency, this.source.token);
            const serverRes = this.props.fetchUsersWithdrawalTransactionsReceipt;
            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
            console.log(serverRes.data);
         
            this.setState({transactions: serverRes.data.data});
        
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
            this.setState({loadingTransactions: false});
        }
    }

    handleWithdrawApproval = async (ref) => {
        try{

            const response = window.confirm("Proceed to approve withdrawal");
            if(response){
                this.props.engageApp(true);
                await this.props.doApproveWithrawalRequest(ref);
                const serverRes = this.props.doApproveWithrawalRequestReceipt;
                if(serverRes.status !== 200){
                    throw { status: serverRes.status, message: serverRes.data  }
                }
                console.log(serverRes.data);
                toastr.success(serverRes.data.message);
   
            }else{
                toastr.info("Request stopped");
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
            this.setState({loadingTransactions: false});
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

                <div className="row" style={{ marginTop: "4.5rem", paddingBottom: "2.5rem", height: "auto", minHeight: "550px" }}>

                    <div className="col-12 mb-2">

                        <h2 className="text-center">
                            <b> Withdrawals </b><hr className="my-1" style={ {width: "2.5rem", borderBottom: "4px solid #283593"} }/>
                        </h2>

                    </div>


                    <div className="col-xs-12 col-sm-12 mx-auto mb-2">
                        <div className="py-3 white round">
                      
                            <div className="row">
                            {
                                    this.state.loadingTransactions ?
                                        
                                        <p className="d-block w-100 text-center" style={ {display: this.state.loadingTransactions ? 'block' : 'none'} }>
                                            <img src="/svg/Loader.svg" width="20%"/>
                                        </p>
                                    
                                    : 
                                    <>
                                        <div className="table-responsive" style={ { display: this.state.transactions.length > 0 ? 'block' : 'none'} }>
                                            <table className="table">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th className="text-center">#</th>
                                                        <th>Amount</th>
                                                        <th>Type</th>
                                                        <th>Status</th>
                                                        <th>Mode</th>
                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.transactions.length > 0 ? 
                                                            this.state.transactions.map( (tnx, i) => {
                                                                return (
                                                                    <tr  data-toggle="modal" data-target="#tnxDetailsModal" onClick={ () => {  this.setState({cur_tnx_in_view:tnx, payToOnWithdraw: tnx.to}); } } key={i}>
                                                                        <td className="text-center">{i+1}</td>
                                                                        <td>{tnx.amount}</td>
                                                                        <td>{tnx.type}</td>
                                                                        <td>{tnx.status}</td>
                                                                        <td>{tnx.mode}</td>
                                                                       
                                                                       
                                                                    </tr>
                                                                )
                                                            })
                                                        :
                                                            null  
                                                    }
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    
                                        <p className="w-100 text-center" style={ {display: this.state.transactions.length > 0 ? 'none' : 'block', fontSize:"2rem"} }>
                                            No withdrawal
                                        </p>
                                    </>      

                                }
                               
                            </div>
                      
                           
                      
                        </div>
                    </div>
                </div>
            </div>

            <div  className="modal fade" id="tnxDetailsModal" tabIndex="-1" role="dialog" aria-hidden="false">
                <div className="modal-dialog modal-register">
                    <div className="modal-content">
                        <div className="modal-header no-border-header text-center">
                            <button type="button" className="close" data-dismiss="modal" id="closeTnxDetailsModal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h6 className="text-muted" style={ {wordWrap: "break-word"} }>
                                {this.state.cur_tnx_in_view.ref}
                            </h6>
                        </div>
                        <div className="modal-body">
                          
                            <div className="d-block">
                                <div className="row p-3">
                                    <div className="col-sm-12 col-md-12 col-lg-6 text-center">
                                        <QRCode value={this.state.payToOnWithdraw} />
                                    </div>
                                </div>
                                <p><b>{this.state.cur_tnx_in_view.type}:</b> <span className="badge badge-secondary">{this.state.cur_tnx_in_view.status}</span></p>
                               
                                <p className="my-3"><b>Amount:</b> {this.state.cur_tnx_in_view.amount}{this.state.cur_tnx_in_view.currency} </p>

                                <p className="my-3"><b>From</b>: {this.state.cur_tnx_in_view.from} <span className="badge badge-warning"> {this.state.cur_tnx_in_view.fromType}</span> </p>

                                <p className="my-3"><b>To</b>: {this.state.cur_tnx_in_view.to} <span className="badge badge-warning">{this.state.cur_tnx_in_view.toType}</span></p>

                                <div className="row">
                                    <h5 className="col-12">Note</h5>
                                    <p className="col-12">{this.state.cur_tnx_in_view.note}, created @ {this.state.cur_tnx_in_view.createdAt} and updated @ {this.state.cur_tnx_in_view.modifiedAt}</p>
                               
                                    {
                                        this.state.cur_tnx_in_view.status === "PENDING" ?
                                       
                                        <button onClick={this.handleWithdrawApproval.bind(this, this.state.cur_tnx_in_view.ref)} className="mt-3 btn btn-sm btn-round btn-danger btn-block">Approve</button>
                                       
                                        :
                                        null
                                    }
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
    console.log(state);
    return {
        appEngaged: state.appEngaged,
        coinSelected: state.coinSelected,
        fetchUsersWithdrawalTransactionsReceipt: state.fetchUsersWithdrawalTransactionsReceipt,
        doApproveWithrawalRequestReceipt: state.doApproveWithrawalRequestReceipt,
    };
}

export default connect(mapStateToProps, { engageApp, unAuthorize, getWithdrawals, doApproveWithrawalRequest })(WithdrawaRequests);