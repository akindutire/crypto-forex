import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import $ from 'jquery';
import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';
import { unAuthorize } from './../../redux/action/AuthAct';
import { getCurrencies, addACoin, getMinableCoins, updateACoin } from './../../redux/action/CoinAct';
import { engageApp } from './../../redux/action/PageAct';
import { getAuthority } from './../../redux/service/FxApi';
import { connect } from 'react-redux';
import axios from 'axios';

class CoinManagement extends Component{

    cancelToken = axios.CancelToken;
    source = this.cancelToken.source();

    constructor(props){
        super(props);

        this.state = {
            
            cur_ref: "",
            ecoin_name: "",
            edesc: "",
            ecurrency: "",
            eexchange_rate_to_hash_power: "",
            ehash_power_unit: "",

            coin_name: "",
            desc: "",
            currency: "",
            mine_rate: "",
            exchange_rate_to_hash_power: "",
            hash_power_unit: "",

            currencies : [],
            minableCoin: [],
        }

        this.getCoins = this.getCoins.bind(this);
        this.handleCoinCreation = this.handleCoinCreation.bind(this);
        this.handleCoinEdit = this.handleCoinEdit.bind(this);
    }

    handleCoinCreation = async () => {

        try{

            this.props.engageApp(true);
    
            const data = {name: this.state.coin_name, description: this.state.desc, currency: this.state.currency, exchangeRateToHashPower: this.state.exchange_rate_to_hash_power, hashPowerUnit: this.state.hash_power_unit, mineRate: this.state.mine_rate};
            
            if(data.name.length < 1 || data.description.length < 1 || data.currency.length < 1 || data.hashPowerUnit.length < 1 ){
                throw { status: 400, message: "Some fields are empty" };
            }

            await this.props.addACoin(data);
            const serverRes = this.props.addCoinReceipt;

            console.log(serverRes.data);

            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
 
            toastr.success(serverRes.data.message);
            this.getCoins();
            
            this.setState({  coin_name: "",
                desc: "",
                currency: "",
                mine_rate: "",
                exchange_rate_to_hash_power: "",
                hash_power_unit: "" });

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

    handleCoinEdit = async () => {
        try{
   
            if(this.state.cur_ref.length > 0){

                this.props.engageApp(true);
                const data = {ref: this.state.cur_ref, name: this.state.ecoin_name, description: this.state.edesc, currency: this.state.ecurrency, exchangeRateToHashPower: this.state.eexchange_rate_to_hash_power, hashPowerUnit: this.state.ehash_power_unit,};
            
                if(data.name.length < 1 || data.description.length < 1 || data.currency.length < 1 ){
                    throw { status: 400, message: "Some fields are empty" };
                }

                await this.props.updateACoin(data);
                const serverRes = this.props.editACoinReceipt;

                console.log(serverRes.data);

                if(serverRes.status !== 200){
                    throw { status: serverRes.status, message: serverRes.data  }
                }
    
                toastr.success(serverRes.data.message);
                this.getCoins();
                
                this.setState({  
                    ecoin_name: "",
                    edesc: "",
                    ecurrency: "",
                  });

                  $('#closeChangeAddrModal').trigger('click');
                  this.getCoins();
            }else{
                throw { status: 400, message: "Unknown coin"};
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

    async componentDidMount(){

        try{

            if(getAuthority() != "ADMIN"){
                this.props.history.push('/start-mining');
            }
 
            $('#bodyClick').trigger('click');
            window.scrollTo(0, 0);

            this.props.engageApp(true);
    
            await this.props.getCurrencies(this.source.token);
            const serverRes = this.props.currencies;

            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
 
            this.setState({currencies: serverRes.data.data});

            this.getCoins();

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

    getCoins = async () => {
        try{

            await this.props.getMinableCoins(this.source.token);
            const serverRes = this.props.minableCoin;
            
            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
 
            console.log(serverRes.data);
            this.setState({minableCoin: serverRes.data.data});

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
        }finally{
            this.props.engageApp(false);
        }
    }

    componentWillUnmount(){
        this.source.cancel();
    }

    render(){
        return (
            <div className="container">
                <ReduxToastr
                    timeOut={10000}
                    newestOnTop={false}
                    preventDuplicates
                    position="top-right"
                    getState={(state) => state.toastr} // This is the default
                    transitionIn="bounceIn"
                    transitionOut="bounceOut"
                    progressBar
                    closeOnToastrClick />

                <div className="row" style={ {marginTop: "4.5rem", paddingBottom: "4.5rem", height:"auto", minHeight:"550px"} }>
                    
                    <div className="col-12 mb-4 mt-4">
                     
                            <p className="my-4">
                               <span style={ {fontSize: "2.2rem"} }><b> Coin  </b></span>
                               <span className="float-right"><Link to="/start-mining"> <i className="fa fa-share text-success"></i> Goto Dashboard  </Link></span>
                            </p>
                        
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-6 my-2">
                        <div className="py-3 white round">
                            <div className="row mb-3">
                                <div className="col-12 "> <h4 className="mt-0 mb-2"><b>Add coin</b></h4> </div>
                            </div>

                            <div className="row">
                            
                                <form className="col-12 mt-3">

                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" required value={this.state.coin_name} onChange={ (e) => { this.setState({ coin_name: e.target.value }); } } placeholder="Coin name" className="form-control" />
                                    </div>

                                    <div className="form-group">
                                        <label>Currency</label>
                                        <select className="form-control" name="currency" onChange={ (e) => { this.setState({currency: e.target.value}) } } value={this.state.currency}>
                                            <option value="">Select currency</option>
                                            {
                                                this.state.currencies.map( (c, i) => {
                                                    return(
                                                        <option key={i} value={c}>{c}</option> 
                                                    );
                                                } )
                                            }
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Mining rate(%)</label>
                                        <input type="number" required min="0" value={this.state.mine_rate} onChange={ (e) => { this.setState({ mine_rate: e.target.value }); } } placeholder="Mining rate" className="form-control" />
                                    </div>

                                    <div className="form-group">
                                        <label>1 {this.state.currency} to hash power</label>
                                        <input type="number" required min="0" value={this.state.exchange_rate_to_hash_power} onChange={ (e) => { this.setState({ exchange_rate_to_hash_power: e.target.value }); } } placeholder="Crypto rate to hash power" className="form-control" />
                                    </div>

                                    <div className="form-group">
                                        <label>Hash power unit</label>
                                        <input type="text" required value={this.state.hash_power_unit} onChange={ (e) => { this.setState({ hash_power_unit: e.target.value }); } } placeholder="Hash Power unit" className="form-control" />
                                    </div>

                                    <div className="form-group">
                                        <label>Coin Description</label>
                                        <textarea required min="0" value={this.state.desc} onChange={ (e) => { this.setState({ desc: e.target.value }); } } placeholder="Description" className="form-control" ></textarea>
                                    </div>

                                </form>
                            </div>

                            <div className="row p-2 my-1">
                                <div className="col-12 col-lg-8 my-1"> 
                                    <button  disabled={this.props.appEngaged} onClick={this.handleCoinCreation} className="btn btn-round btn-danger btn-block">
                                        { this.props.appEngaged ? 'Processing' : 'Create' }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-6 my-2">
                        <div className="py-3 white round">
                            <div className="row mb-3">
                                <div className="col-12 "> <h4 className="mt-0 mb-2"><b>Coins</b></h4> </div>
                            </div>

                            <div className="row mb-3 p-3">
                                {
                                    this.state.minableCoin.map( (c, i) => {
                                        
                                        return(
                                            <div key={i} className="card col-12" style={ {backgroundColor: "#eeeeee"} }>
                                                <div className="card-body">
                                                    <h6 className="author float-left">{c.name}</h6>
                                                    <span className="category-social text-info float-right">
                                                        <i className="fa fa-circle text-success"></i> {c.currency}
                                                    </span>
                                                    <div className="clearfix"></div>
                                                    <div className="card-description text-center">
                                                        <h5>1 {c.currency} ~ {c.exchangeRateToHashPower}{c.hashPowerUnit} </h5>
                                                        <p className="text-truncate">{c.description}</p>
                                                    </div>
                                                    
                                                    <div className="row">
                                            
                                                        <div className="p-1 col-sm-12 col-md-6">
                                                            <button data-toggle="modal" data-target="#editCoinModal" onClick={ () => {this.setState({ cur_ref: c.ref, ecoin_name: c.name, edesc: c.description, eexchange_rate_to_hash_power: c.exchangeRateToHashPower, ehash_power_unit: c.hashPowerUnit, ecurrency: c.currency });  } } className="btn btn-sm btn-round btn-danger mt-3 btn-block">Edit</button>
                                                        </div>

                                                        <div className="p-1 col-sm-12 col-md-6">
                                                            <Link to={"/rate/"+c.ref} className="btn btn-sm btn-round btn-success mt-3  btn-block">Rates</Link>
                                                        </div>

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

                
                {/* Change coin modal */}

                <div  className="modal fade" id="editCoinModal" tabIndex="-1" role="dialog" aria-hidden="false">
                    <div className="modal-dialog modal-register">
                        <div className="modal-content">
                            <div className="modal-header no-border-header text-center">
                                <button type="button" className="close" data-dismiss="modal" id="closeEditCoinModal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h6 className="text-muted">Edit coin</h6>
                            </div>
                            <div className="modal-body">
                                
                                <form>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" required value={this.state.ecoin_name} onChange={ (e) => { this.setState({ ecoin_name: e.target.value }); } } placeholder="Coin name" className="form-control" />
                                    </div>

                                    <div className="form-group">
                                        <label>Currency</label>
                                        <select className="form-control" name="currency" onChange={ (e) => { this.setState({ecurrency: e.target.value}) } } value={this.state.ecurrency}>
                                            <option value="">Select currency</option>
                                            {
                                                this.state.currencies.map( (c, i) => {
                                                    return(
                                                        <option key={i} value={c}>{c}</option> 
                                                    );
                                                } )
                                            }
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Hash power unit</label>
                                        <input type="text" required value={this.state.ehash_power_unit} onChange={ (e) => { this.setState({ ehash_power_unit: e.target.value }); } } placeholder="Hash Power unit" className="form-control" />
                                    </div>

                                    <div className="form-group">
                                        <label>Crypto rate to hash power</label>
                                        <input type="number" required min="0" value={this.state.eexchange_rate_to_hash_power} onChange={ (e) => { this.setState({ eexchange_rate_to_hash_power: e.target.value }); } } placeholder="Crypto rate for hash power" className="form-control" />
                                    </div>

                                    <div className="form-group">
                                        <label>Coin Description</label>
                                        <textarea required value={this.state.edesc} onChange={ (e) => { this.setState({ edesc: e.target.value }); } } placeholder="Description" className="form-control" ></textarea>
                                    </div>

                                    <button type="button"
                                    disabled={this.appEngaged} onClick={this.handleCoinEdit} className="btn btn-block btn-round btn-danger">     { this.appEngaged ? 'Procesing' : 'Submit' } 
                                    </button>

                                </form>
                                
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
        currencies: state.currencies,
        addCoinReceipt: state.addCoinReceipt,
        minableCoin: state.minableCoin,
        editACoinReceipt: state.editACoinReceipt,
    };
}

export default connect(mapStateToProps, {  engageApp, unAuthorize, getCurrencies, addACoin, getMinableCoins, updateACoin })(CoinManagement);