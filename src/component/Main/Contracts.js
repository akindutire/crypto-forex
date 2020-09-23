import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';

import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';

import { unAuthorize } from './../../redux/action/AuthAct';
import {  engageApp } from './../../redux/action/PageAct';
import { getContractsForAFold, renewContract, releaseContract, moveFundsToFold } from './../../redux/action/ContractAct';

import { connect } from 'react-redux';


class Contracts extends Component{

    cancelToken = axios.CancelToken;
    source = this.cancelToken.source();

    constructor(props){
        super(props);


        this.state = {
            dailyHashPowerReturn: 0,
            rates: [],
            contracts: [],
            cur_contract_in_view: [],
            cur_contract_history_in_view: [],
            loadingContracts: true,
            cur_coin: [],
            contract_fund_withrawal_field: 0,
        }

        this.loadContracts = this.loadContracts.bind(this);
        this.calculateDailyReturns = this.calculateDailyReturns.bind(this);
        this.handleContractRenewal = this.handleContractRenewal.bind(this);
        this.handleFundMovement = this.handleFundMovement.bind(this);
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

       this.loadContracts();
    }

    calculateDailyReturns = (hashPowerPurchased) => {

        let rate;
       
        rate = this.state.rates.filter((r) => {  
            if(r.minHashPower <= hashPowerPurchased && (r.maxHashPower === 0 || r.maxHashPower >= hashPowerPurchased) ){
                return r;
            }
        }); 

        if(rate.length > 0){
            const c = ( (rate[0].mineRate)/100) * ( hashPowerPurchased / this.state.cur_coin.exchangeRateToHashPower);

            this.setState({dailyHashPowerReturn: c.toFixed(4)});
        }else{
            this.setState({dailyHashPowerReturn: 0.0000});
        }
    }

    loadContracts = async () => {
        try{

            await this.props.getContractsForAFold(this.props.coinSelected.currency, this.source.token);
            const serverRes = this.props.contractForAFoldThroughCurrency;
            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
            this.setState({contracts: serverRes.data.data});
        
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
            this.setState({loadingContracts: false});
        }
    }

    handleContractRenewal = async (ref) => {
        try{

            await this.props.renewContract(ref, this.source.token);
            const serverRes = this.props.contractRenewalReceipt;
            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
           toastr.success(serverRes.data.message);

            this.loadContracts();
        
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

    handleContractRelease = async (ref) => {
        try{

            const response = window.confirm("Proceed with contract release");
            if(response){
                await this.props.releaseContract(ref, this.source.token);
                const serverRes = this.props.contractReleaseReceipt;
                if(serverRes.status !== 200){
                    throw { status: serverRes.status, message: serverRes.data  }
                }
                toastr.success(serverRes.data.message);
                this.loadContracts();    
            }else{
                toastr.info("Contract release cancelled");
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

    handleFundMovement = async (ref) => {
        try{

            await this.props.moveFundsToFold(this.state.cur_coin.currency, ref, this.state.contract_fund_withrawal_field);
            const serverRes = this.props.fundMovementOutOfContractReceipt;
            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
            toastr.success(serverRes.data.message);
            $('#closeContractDetailsModal').trigger('click');
            this.loadContracts();
            
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

                    <div className="col-12 mb-2">

                        <h2 className="text-center">
                            <b> Contracts </b><hr className="my-1" style={ {width: "2.5rem", borderBottom: "4px solid #283593"} }/>
                        </h2>

                    </div>


                    <div className="col-xs-12 col-sm-12 mx-auto mb-2">
                        <div className="py-3 white round">
                      
                            <div className="row">
                            {
                                    this.state.loadingContracts ?
                                        
                                        <p className="d-block w-100 text-center" style={ {display: this.state.loadingContracts ? 'block' : 'none'} }>
                                            <img src="/svg/Loader.svg" width="20%"/>
                                        </p>
                                    
                                    : 
                                    <>
                                        <div className="table-responsive" style={ { display: this.state.contracts.length > 0 ? 'block' : 'none'} }>
                                            <table className="table">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th className="text-center">#</th>
                                                        <th>Amount invested</th>
                                                        <th>Duration(days)</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.contracts.length > 0 ? 
                                                            this.state.contracts.map( (contract, i) => {
                                                                return (
                                                                    <tr data-toggle="modal" data-target="#contractDetailsModal" onClick={ () => { this.calculateDailyReturns(contract.hashPowerPurchased); this.setState({cur_contract_in_view:contract, cur_contract_history_in_view:contract.history}); } } key={i}>
                                                                        <td className="text-center">{i+1}</td>
                                                                        <td>{contract.amountInvested}{this.state.cur_coin.currency} ~ {contract.hashPowerPurchased}{this.state.cur_coin.hashPowerUnit}</td>
                                                                        <td>{contract.lifeSpan}</td>
                                                                        <td>{contract.status}</td>
                                                                        <td>
                                                                            {
                                                                                contract.status == "SUSPENDED" ?
                                                                                    <>
                                                                                        <span className="p-1 mr-1">
                                                                                            <button onClick={this.handleContractRenewal.bind(this, contract.ref)} className="btn btn-sm btn-round btn-danger">Renew</button>
                                                                                        </span>

                                                                                        <span className="p-1">
                                                                                            <button onClick={this.handleContractRelease.bind(this, contract.ref)} className="btn btn-sm btn-round btn-warning">Release</button>
                                                                                        </span>
                                                                                    </>
                                                                                    :
                                                                                        null
                                                                            }   
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        :
                                                            null  
                                                    }
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    
                                        <p className="w-100 text-center" style={ {display: this.state.contracts.length > 0 ? 'none' : 'block', fontSize:"2rem"} }>
                                            No contract
                                        </p>
                                    </>      

                                }
                               
                            </div>
                      
                           
                      
                        </div>
                    </div>
                </div>
            </div>

    
            <div  className="modal fade" id="contractDetailsModal" tabIndex="-1" role="dialog" aria-hidden="false">
                <div className="modal-dialog modal-register">
                    <div className="modal-content">
                        <div className="modal-header no-border-header text-center">
                            <button type="button" className="close" data-dismiss="modal" id="closeContractDetailsModal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h6 className="text-muted">
                                {this.state.cur_contract_in_view.ref}
                            </h6>
                        </div>
                        <div className="modal-body">
                        
                            <div className="d-block">
                                <p><b className="btn btn-secondary">{this.state.cur_contract_in_view.status}</b> </p>
                                <h3><span className="text-success">{this.state.cur_contract_in_view.interestAmountAccumulated}{this.state.cur_coin.currency}</span> Mined</h3>
                                <p className="my-3"> {this.state.cur_contract_in_view.amountInvested}{this.state.cur_coin.currency} ~ {this.state.cur_contract_in_view.hashPowerPurchased}{this.state.cur_coin.hashPowerUnit} Purchased</p>

                                {
                                    this.state.cur_contract_in_view.interestAmountAccumulated > this.state.dailyHashPowerReturn 
                                    ? 
                                        <p className="my-3">{this.state.dailyHashPowerReturn}{this.state.cur_coin.currency} mined daily</p>
                                    :
                                        null
                                }
                                <hr />

                                <div className="row">
                                    <h5 className="col-12">Contract history</h5>
                                    {
                                        this.state.cur_contract_history_in_view.map( (h,i) => {
                                            return(
                                                    <div key={i} className="col-sm-12 col-md-12">
                                                        <div className="card" style={ {backgroundColor: "#e8eaf6", color: "#000000"} }>
                                                            <div className="card-body" >
                                                                
                                                                <div className="card-description text-dark">
                                                                    {h.note} - {h.createdAt}
                                                                </div>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                            );
                                        } )
                                    }
                                </div>


                                <div className="row mt-2">
                                    <h5 className="col-12">Contract fund withdrawal</h5>
                                    <div className="form-group col-12 container">
                                        <label>Amount</label>
                                        <input className="form-control" type="number" id="newAddrInput" value={this.contract_fund_withrawal_field} onChange={(e) => { this.setState({ contract_fund_withrawal_field: e.target.value }) }} placeholder="Amount" className="form-control" />
                                    </div>

                                    <button
                                        disabled={!this.state.contract_fund_withrawal_field > 0 || this.props.appEngaged} className="btn btn-block btn-round btn-danger" onClick={() => { this.handleFundMovement(this.state.cur_contract_in_view.ref); }}> Move to {this.state.cur_coin.currency} wallet</button>

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
        contractForAFoldThroughCurrency: state.contractForAFoldThroughCurrency,
        contractRenewalReceipt: state.contractRenewalReceipt,
        contractReleaseReceipt: state.contractReleaseReceipt,
        fundMovementOutOfContractReceipt: state.fundMovementOutOfContractReceipt,
    };
}

export default connect(mapStateToProps, { engageApp, unAuthorize, getContractsForAFold, renewContract, releaseContract, moveFundsToFold })(Contracts);