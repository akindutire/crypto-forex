import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

import { connect } from 'react-redux';

import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';

import { unAuthorize, getProfile } from './../../redux/action/AuthAct';
import { engageApp, setHashPowerToPurchase } from './../../redux/action/PageAct';
import { getMinableCoins, selectCoinToMine, getCurrencies, selectAWalletFold, } from '../../redux/action/CoinAct';
import { getContractsForAFold } from './../../redux/action/ContractAct';

import $ from 'jquery';
import axios from 'axios';

class Dashboard extends Component{

    cancelToken = axios.CancelToken;
    source = this.cancelToken.source();

    currencyStandardPrice = {
        BTC: 10692,
        ETH: 378,
        LTC: 49,
        DOGE: 0.0027,
        DASH: 76,
        ZEC: 62
    };

       //Minimum amounts
    MinimumDeposits = {
        BTC: 0.00090,
        ETH: 0.026,
        LTC: 0.21,
        DOGE: 3670,
        ZEC: 0.17,
        DASH: 0.14
    };


    constructor(props){
        super(props);
        

        this.state = {
          
            minableCoin: [],
            profile: {
                name: "",
                email: "",
                createdAt: "",
                coinMined: "",
            },
            purchase_hash_power: 0,
            purchase_crypto_amount: 0,
            cur_coin: [],
            currencies: [],
            fold: [],
            contracts: [],
            rates: [],
            last_purchase: "",
            last_withdrawal: "",
            coinMinedPerday: 0,
            coinMined:0,
            meterVal:0,
            dailyHashPowerReturn:0,
            loadingDashboard: true,
        }

        this.selectACoin = this.selectACoin.bind(this);
        this.loadDashboard = this.loadDashboard.bind(this);
        this.calculateDailyReturns = this.calculateDailyReturns.bind(this);
        this.handleConfirmationAndPayment = this.handleConfirmationAndPayment.bind(this);
    }

    selectACoin = async (coin) => {
       
        await this.props.selectCoinToMine(coin);
        if(this.props.coinSelected.ref.length > 0){
            this.loadDashboard();
        }else{
            toastr.error("Couldn't select a coin");
        }
    }

    loadDashboard = async () => {
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

        try{

            this.setState({loadingDashboard: true});

            this.props.engageApp(true);
            await this.props.getMinableCoins(this.source.token);
            let serverRes = this.props.minableCoin;
            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
            if(serverRes.data.data.length < 1){
                this.props.history.push('/start-mining');
                return;
            }
            this.setState({minableCoin: serverRes.data.data});


            await this.props.getProfile();
            serverRes = this.props.currentUserProfile;
            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
            
            const p = serverRes.data.data;
            const cur = this.props.coinSelected.currency;
            const meter = (p.coinMinedPerDay[cur] - 0) / 10;

            this.setState({profile: p, coinMined: p.coinMined[cur], coinMinedPerday: p.coinMinedPerDay[cur], last_purchase: p.lastPurchaseAndWithdrawal[cur].LP, last_withdrawal: p.lastPurchaseAndWithdrawal[cur].LW, meterVal: meter });



            await this.props.selectAWalletFold(this.props.coinSelected.currency, this.source.token);
            serverRes = this.props.walletFoldForACurrency;
            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
            this.setState({fold: serverRes.data.data});
            

            await this.props.getContractsForAFold(this.props.coinSelected.currency, this.source.token);
            serverRes = this.props.contractForAFoldThroughCurrency;
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
            this.setState({loadingDashboard: false, purchase_crypto_amount: 0, purchase_hash_power: 0});
        }
    }

    handleConfirmationAndPayment = () => {
        if(this.state.purchase_crypto_amount < this.MinimumDeposits[this.props.coinSelected.currency]){
            throw {status: 400, message: "Minimum amount deposit has been reached"};
        }
        this.props.setHashPowerToPurchase({h: this.state.purchase_hash_power, ad: undefined});
        this.props.history.push(`/pay`);
    }

    calculateDailyReturns = (hashPowerToBePurchased) => {

        let rate;
       
        rate = this.state.rates.filter((r) => {  
            if(r.minHashPower <= hashPowerToBePurchased && (r.maxHashPower === 0 || r.maxHashPower >= hashPowerToBePurchased) ){
                return r;
            }
        }); 

        if(rate.length > 0){
            const c = ( ( (rate[0].mineRate)/100) * (hashPowerToBePurchased/this.state.cur_coin.exchangeRateToHashPower) ) * 86400;
            this.setState({dailyHashPowerReturn: c.toFixed(4)});
        }else{
            this.setState({dailyHashPowerReturn: 0.0000});
        }

    }

    async componentDidMount(){
        $('#bodyClick').click();
        window.scrollTo(0, 0);
        this.loadDashboard();
    }

    componentWillUnmount(){
        this.source.cancel();
    }

    render(){
        return(
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

                    <div className="row" style={ {marginTop: "4.5rem", paddingBottom: "4.5rem", height:"auto", minHeight:"550px"} }>
                        
                        <div className="col-12 mb-4">
                        
                                <h2>
                                <b> Dashboard </b>
                                </h2>
                            
                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-6 my-2">
                            <div className="py-3 white round">
                                <div className="row my-1">
                                    <div className="col-12">
                                        <Link to="/profile"><span> <i className="fas fa-user text-success"></i></span> <b className="text-danger">{this.state.profile.email}</b> </Link>
                                        <span className="float-right">
                                        {
                                                this.state.coinMined > 0 ?
                                                    <i className="fas fa-fan fa-spin text-success"></i>
                                                :
                                                    <em className="text-muted">Inactive</em>
                                            }
                                            
                                        </span>
                                    </div>
                                </div>

                                <div className="row p-2">
                                    <div className="col-sm-2 col-lg-1 col"> <i className="fas fa-wallet fa-2x mt-2 text-danger"></i> </div>
                                    {
                                        this.state.fold.balance !== undefined ? 
                                        <div className="col-10">
                                            
                                            <p>Available balance</p> <p><span className=""><b>{this.state.fold.balance.toFixed(8)}</b></span> <span>{this.state.fold.currency}</span></p>
                                        
                                            {/* <p>Ledger balance</p> <p><span className="text-muted"><b>{this.state.fold.ledgerBal.toFixed(8)}</b></span> <span>{this.state.fold.currency}</span></p> */}
                                        
                                        </div>
                                        :
                                        null    
                                    }                            
                                    
                                </div>

                                <div className="row p-2 my-1">
                                    <div className="col-12 col-lg-4 my-1">
                                        <button className="btn btn-round btn-danger btn-block" onClick={ () => this.props.history.push('/withdraw') }>Send <b className="caret"></b></button>
                                        <ul className="dropdown-menu dropdown-menu-right">
                                            <div className="dropdown-header">Switch to</div>
                                        
                                            {/* <div className="dropdown-divider"></div>
                                            <a className="dropdown-item" href="#">Separated link</a> */}
                                        </ul>
                                    </div>
                                    <div className="col-12 col-lg-8 my-1"> 
                                        <button className="dropdown-toggle btn btn-round btn-danger btn-block" data-toggle="dropdown">Other currencies <b className="caret"></b></button>
                                    
                                        <ul className="dropdown-menu dropdown-menu-right" style={ { borderBottom: "1px solid #bdbdbd"} }>
                                            <div className="dropdown-header">Switch to</div>
                                            {
                                                this.state.minableCoin.map( (coin, i) => {
                                                    return(
                                                        <a key={i} className="dropdown-item" onClick={ () => {this.selectACoin(coin); } }>{coin.currency}</a>
                                                    );
                                                } )
                                            }
                                        </ul>  
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-6 my-2">
                            <div className="py-3 white round">
                                <div className="row mb-3">
                                    <div className="col-12 "> <h4 className="mt-0 mb-2"><b>Details</b><span className="float-right"> <Link to="/profile"><i className="fas fa-cogs"></i></Link></span> </h4> </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-12">
                                        <div className="d-block">
                                        <p className=""> <span>{this.state.profile.name}</span> </p>
                                            <p className="my-2"> <span> <i className="fas fa-dot-circle text-small text-success"></i> <b>E-mail:</b></span> <span>{this.state.profile.email}</span> </p>
                                            <p className="my-2"> <span> <i className="fas fa-dot-circle  text-small text-success"></i> <b>Registered on</b></span> <span>{this.state.profile.createdAt}</span> </p>
                                            <p className="mt-2"> <span> <i className="fas fa-dot-circle  text-small text-success"></i> <b>Coins mined:</b></span> <span><b>{this.state.coinMined}</b></span> <span className="text-success">{this.state.cur_coin.currency}</span> </p>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-xs-12 col-sm-12 col-md-6 my-2">
                            
                            <div className="pb-4 white round">

                                <div className="row">
                                    <div className="col-12 py-3"> 
                                        <span style={ {fontSize: '1.5rem'} }>
                                            <b>Purchase Hashing Power</b>
                                        </span> 
                                    
                                        <span className="badge badge-warning float-right">{this.state.cur_coin.name} Price ${this.currencyStandardPrice[this.props.coinSelected.currency]}</span>
                                    
                                    </div>
                                    
                                </div>

                                <div className="row">
                                
                                    <form className="col-12 mt-3">

                                        <div className="form-group">
                                            <label>Hash Power</label>
                                            <input type="number" required value={this.state.purchase_hash_power} onChange={ (e) => { this.setState({ purchase_hash_power:e.target.value, purchase_crypto_amount: e.target.value/this.state.cur_coin.exchangeRateToHashPower }); this.calculateDailyReturns(e.target.value) } } placeholder="Hash Power" className="form-control" />
                                        </div>

                                        <div className="form-group">
                                            <label>Amount to be paid({this.state.cur_coin.currency})</label>
                                            <input type="number" required value={this.state.purchase_crypto_amount} onChange={ (e) => { this.setState({ purchase_crypto_amount: e.target.value, purchase_hash_power: e.target.value*this.state.cur_coin.exchangeRateToHashPower}); this.calculateDailyReturns(e.target.value*this.state.cur_coin.exchangeRateToHashPower) } } placeholder="Amount" className="form-control" />
                                        </div>

                                        <div className="row p-2">
                                            <div className="d-block mx-auto text-center">
                                                <span>Minimum deposit: <b>{this.MinimumDeposits[this.props.coinSelected.currency]}</b> <b className="text-success">{this.props.coinSelected.currency}</b></span>
                                            </div>
                                        </div>

                                    </form>

                                    <div className="col-12 my-3">
                                        <p className="d-block"> <i className="fas fa-table text-success"></i> Costs</p>
                                        <ul className="list-group">
                                            <li className="list-group-item">
                                                <span><b>Price | {this.state.cur_coin.currency}</b>:</span> 
                                                <span className="float-right">
                                                    {1}
                                                    <span className="ml-1 text-primary">{this.state.cur_coin.currency}</span>
                                                </span>
                                            </li>

                                            <li className="list-group-item">
                                                <span><b>Price |  {this.state.cur_coin.hashPowerUnit}</b>:</span> 
                                                <span className="float-right">
                                                    {this.state.cur_coin.exchangeRateToHashPower} 
                                                    <span className="ml-1 text-primary"> {this.state.cur_coin.hashPowerUnit}</span>
                                                </span>
                                            </li>
                                        </ul>
        
                                    </div>

                                    <div className="col-12 my-3">
                                        <p className="d-block"> <i className="fas fa-table text-success"></i> Approximation</p>
                                        <ul className="list-group mb-3">
                                            {
                                                this.state.loadingDashboard === false ?
                                                    <>
                                                        <li className="list-group-item">
                                                            <span><b>Hourly |  {this.state.cur_coin.hashPowerUnit}</b>:</span> 
                                                            <span className="float-right">
                                                                { (this.state.dailyHashPowerReturn/24).toFixed(4) }
                                                                <span className="ml-1 text-primary"> {   this.state.cur_coin.hashPowerUnit  }</span>
                                                            </span>
                                                        </li>
                                                    
                                            
                                                        <li className="list-group-item">
                                                            <span><b>Daily |  {this.state.cur_coin.hashPowerUnit}</b>:</span> 
                                                            <span className="float-right">
                                                                {this.state.dailyHashPowerReturn}
                                                                <span className="ml-1 text-primary">{this.state.cur_coin.hashPowerUnit}</span>
                                                            </span>
                                                        </li>
                                                    </>
                                                :
                                                    null
                                            }
 
                                        </ul>

                                        <p className="d-block mt-4"> <button onClick={this.handleConfirmationAndPayment} disabled={this.state.dailyHashPowerReturn === 0 || typeof this.state.dailyHashPowerReturn == NaN} className="btn btn-rotate btn-round btn-danger btn-block"> Confirm & Pay <i className="fas fa-arrow-right"></i></button> </p>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-6 my-2">
                            <div className="white round pb-4">
                                <div className="row">
                                    <div className="col-12 py-3"> <span style={ {fontSize: '1.5rem'} }><b>Mining Status</b></span> 
                                        <span className="float-right">
                                            {
                                                this.state.coinMined > 0 ?
                                                    <><i className="fas fa-vector-square text-success"></i> Active</>
                                                :
                                                    <i></i> 
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <div className="d-block">
                                            <p className="my-2"> <meter value={this.state.meterVal} min="0" max="10" high="7.5" low="2.0" optimum="5.0">{this.state.meterVal <= 10 ? this.state.meterVal +'of' + 10 : '10+'}</meter> </p>
                                            <p className="my-2 text-center"> Your Mining Speed is  <span className="badge" style={{backgroundColor: this.state.meterVal < 3 ? '#c62828 ' : '#1a237e '}}>{this.state.meterVal < 3 ? 'Slow' : 'Fast'}</span> </p>
                                        </div>
                                    </div>

                                    <div className="col-8">
                                        <div className="d-block">
                                            <p className="my-2"> Approximate coins mined per hour</p>
                                            <p className="my-2 text-lg"> <b>~{this.state.coinMinedPerday/24}</b> <span className="text-sucess">{this.state.cur_coin.currency}</span> </p>
                                        <p className="my-2 text-sm"> <b>~{this.state.coinMinedPerday}</b> <span className="text-sucess">{this.state.cur_coin.currency}/day</span> </p>
                                            
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="row mt-4" style={ {background: "#f5f5f5"} }>

                                            <div className="col-6 p-3 border-muted border-right">
                                                <div className="d-block">
                                                    <p><i className="fas fa-layer-group fa-2x text-success"></i></p>
                                                    <p>Last Purchase<br /> <span><b>{this.state.last_purchase}</b><span className="text-success ml-1">{this.state.cur_coin.currency}</span></span></p>
                                                </div>
                                            </div>
                                            
                                            <div className="col-6 p-3">
                                                <div className="d-block">
                                                    <p><i className="fas fa-share fa-2x text-success"></i></p>
                                                    <p>Last Withdrawal: <br /><span><b>{this.state.last_withdrawal}</b><span className="text-success ml-1">{this.state.cur_coin.currency}</span></span></p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-12 my-2">
                            <div className="white round pb-4">
                                <div className="row">
                                    <div className="col-12 py-3"> <span style={ {fontSize: '1.5rem'} }><b>Forex fundamental data</b></span> </div>
                                </div>

                                <div className="row">
                                    <div className="col-12" style={{overflowX: "scroll"}}>
                                        <TradingViewWidget locale="en" symbol="NASDAQ:AAPL" />
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                
                {/* Loading Dashboard modal */}
                {
                    this.state.loadingDashboard 
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
                                                    <p className="text-center"> Loading Dashboard </p>
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
    // console.log(state);
    return {
        appEngaged: state.appEngaged,
        coinSelected: state.coinSelected,
        minableCoin: state.minableCoin,
        currentUserProfile: state.currentUserProfile,
        currencies: state.currencies,
        walletFoldForACurrency: state.walletFoldForACurrency,
        contractForAFoldThroughCurrency: state.contractForAFoldThroughCurrency,
    };
}

export default connect(mapStateToProps,{engageApp, unAuthorize, getMinableCoins, selectCoinToMine, getProfile, getCurrencies, selectAWalletFold, getContractsForAFold, setHashPowerToPurchase})(Dashboard);