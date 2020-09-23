import React, { Component } from 'react';
import { connect } from 'react-redux';

import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';

import { unAuthorize, getProfile } from './../../redux/action/AuthAct';
import { engageApp } from './../../redux/action/PageAct';
import { getMinableCoins, selectCoinToMine, getCurrencies, } from './../../redux/action/UserAct';

import $ from 'jquery';
import axios from 'axios';

class Users extends Component{

    cancelToken = axios.CancelToken;
    source = this.cancelToken.source();

    constructor(props){
        super(props);
        
        this.state = {
            hash_power: "",
            crypto_amount: "",
            minableCoin: [],
            profile: {
                name: "",
                email: "",
                registeredOn: "",
                coinMined: "",
            },
            currencies: [],
        }

        this.selectACoin = this.selectACoin.bind(this);
    }

    selectACoin = async (key) => {

        await this.props.selectCoinToMine(key);
        if(this.props.coinSelected.length > 0){
            this.props.history.push('/dashboard');
        }else{
            toastr.error("Couldn't select a coin");
        }
    }

    async componentDidMount(){
        $('#bodyClick').click();
        window.scrollTo(0, 0);

        if(this.props.coinSelected.trim().length === 0){
            this.props.history.push('/start-mining');
            return;
        }

        try{

            await this.props.getMinableCoins(this.source.token);
            this.setState({minableCoin: this.props.minableCoin, loading: false});

            await this.props.getProfile(this.source.token);
            const serverRes = this.props.currentUserProfile;

            console.log(serverRes);

            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }

            this.setState({profile: serverRes.data});

            await this.props.getCurrencies(this.source.token);
            serverRes = this.props.currencies;

            console.log(serverRes.data.data);

            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
 
            this.setState({currencies: serverRes.data.data});
            

        }catch(e){
            
            if(typeof e.message == "object"){
                if(e.status === 401 || e.status === 403){
                    this.props.unAuthorize();
                }else{
                    toastr.error(e.message.message); 
                }
            }else{
                toastr.error(e.message);
            }
        }
    }

    componentWillUnmount(){
        this.source.cancel();
    }

    render(){
        return(
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

                <div className="row" style={ {marginTop: "4.5rem", paddingBottom: "4.5rem", height:"auto", minHeight:"550px"} }>
                    
                    <div className="col-12 mb-4">
                     
                            <h2>
                               <b> Dashboard </b>
                            </h2>
                        
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-6 my-2">
                        <div className="py-3 white round">
                            <div className="row my-1">
                                <div className="col-12"><span> <i className="fas fa-user text-success"></i></span> <b>akindutire33@gmail.com</b> <span className="pull-right"><i className="fas fa-cog"></i></span></div>
                            </div>

                            <div className="row p-2">
                                <div className="col-sm-2 col-lg-1 col"> <i className="fab fa-ethereum fa-2x mt-2 text-danger"></i> </div>
                            
                                <div className="col-10"><p>Available balance</p> <p><span className=""><b>0.6623553</b></span> <span>ETH</span></p></div>
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
                                                    <a key={i} href="#" className="dropdown-item" onClick={ () => {this.selectACoin(coin.key); } }>{coin.key}</a>
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
                                <div className="col-12 "> <h4 className="mt-0 mb-2"><b>Details</b></h4> </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-12">
                                    <div className="d-block">
                                        <p className="my-2"> <span> <i className="fas fa-dot-circle text-small text-success"></i> <b>E-mail:</b></span> <span>akindutire33@gmail.com</span> </p>
                                        <p className="my-2"> <span> <i className="fas fa-dot-circle  text-small text-success"></i> <b>Registered on</b></span> <span>Jul-29</span> </p>
                                        <p className="my-2 mb-4"> <span> <i className="fas fa-dot-circle  text-small text-success"></i> <b>Coins mined:</b></span> <span><b>0.456666</b></span> <span className="text-success">ETH</span> </p>
                                        <button className="btn btn-round btn-danger btn-block mt-3">Goto Profile</button>
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
                                   
                                    <span className="badge badge-warning pull-right">Ethereum Price $2345</span>
                                   
                                </div>
                                
                            </div>

                            <div className="row">
                            
                                <form className="col-12 mt-3">

                                    <div className="form-group">
                                        <label>Hash Power</label>
                                        <input type="number" required min="0" value={this.state.hash_power} onChange={ (e) => { this.setState({ hash_power: e.target.value }); } } placeholder="Hash Power" className="form-control" />
                                    </div>

                                    <div className="form-group">
                                        <label>Amount to be paid(ETH)</label>
                                        <input type="number" required min="0" value={this.state.crypto_amount} onChange={ (e) => { this.setState({ crypto_amount: e.target.value }); } } placeholder="Amount" className="form-control" />
                                    </div>

                                </form>

                                <div className="col-12 my-3">
                                    <p className="d-block"> <i className="fas fa-table text-success"></i> Costs</p>
                                    <ul className="list-group">
                                        <li className="list-group-item">
                                            <span><b>Price | MH/s</b>:</span> 
                                            <span className="pull-right">
                                                0.45633 
                                                <span className="ml-1 text-primary">USD</span>
                                            </span>
                                        </li>

                                        <li className="list-group-item">
                                            <span><b>Price | ETH</b>:</span> 
                                            <span className="pull-right">
                                                0.45633 
                                                <span className="ml-1 text-primary">ETH</span>
                                            </span>
                                        </li>
                                    </ul>
    
                                </div>

                                <div className="col-12 my-3">
                                    <p className="d-block"> <i className="fas fa-table text-success"></i> Approximation</p>
                                    <ul className="list-group mb-3">
                                        <li className="list-group-item">
                                            <span><b>Hourly | ETH</b>:</span> 
                                            <span className="pull-right">
                                                0.45633 
                                                <span className="ml-1 text-primary">ETH</span>
                                            </span>
                                        </li>

                                        <li className="list-group-item">
                                            <span><b>Daily | ETH</b>:</span> 
                                            <span className="pull-right">
                                                0.45633 
                                                <span className="ml-1 text-primary">ETH</span>
                                            </span>
                                        </li>
                                    </ul>

                                    <p className="d-block mt-4"> <button className="btn btn-rotate btn-round btn-danger btn-block"> Confirm & Pay <i className="fas fa-arrow-right"></i></button> </p>
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-6 my-2">
                        <div className="white round pb-4">
                            <div className="row">
                                <div className="col-12 py-3"> <span style={ {fontSize: '1.5rem'} }><b>Mining Status</b></span> <span className="pull-right"><i className="fas fa-vector-square text-success"></i> Active</span></div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="d-block">
                                        <p className="my-2"> <meter value="20" min="0" max="100" high="75" low="20" optimum="50">2 out of 10</meter> </p>
                                        <p className="my-2 text-center"> Your Mining Speed is  <span className="badge badge-danger">Slow</span> </p>
                                    </div>
                                </div>

                                <div className="col-8">
                                    <div className="d-block">
                                        <p className="my-2"> Approximate coins mined per hour</p>
                                        <p className="my-2 text-lg"> <b>~0.004432</b> <span className="text-sucess">ETH</span> </p>
                                        <p className="my-2 text-sm"> <b>~0.00004432</b> <span className="text-sucess">ETH/day</span> </p>
                                        
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="row mt-4" style={ {background: "#f5f5f5"} }>

                                        <div className="col-6 p-3 border-muted border-right">
                                            <div className="d-block">
                                                <p><i className="fas fa-layer-group fa-2x text-success"></i></p>
                                                <p>Last Purchase<br /> <span><b>0.000053</b><span className="text-success ml-1">ETH</span></span></p>
                                            </div>
                                        </div>
                                        
                                        <div className="col-6 p-3">
                                            <div className="d-block">
                                                <p><i className="fas fa-share fa-2x text-success"></i></p>
                                                <p>Last Withdrawal: <br /><span><b>0.000053</b><span className="text-success ml-1">ETH</span></span></p>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
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
    };
}

export default connect(mapStateToProps,{engageApp, unAuthorize,getMinableCoins, selectCoinToMine, getProfile, getCurrencies})(Users);