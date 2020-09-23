import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import $ from 'jquery';
import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';
import { unAuthorize } from '../../redux/action/AuthAct';
import { getCurrencies, updateACoin, fetchACoin, editOrAddRate } from '../../redux/action/CoinAct';
import { engageApp } from '../../redux/action/PageAct';
import { getAuthority } from './../../redux/service/FxApi';

import axios from 'axios';
import { connect } from 'react-redux';

class CoinRate extends Component{

    cancelToken = axios.CancelToken;
    source = this.cancelToken.source();

    constructor(props){
        super(props);

        this.state = {
 
            rate_label: "",
            mine_rate: "",
            min: "",
            max: "",

            coin_ref: "",
            coin_name: "",

            currencies : [],
            rates: []
        }

        this.getRates = this.getRates.bind(this);
        this.handleRateAppend = this.handleRateAppend.bind(this);
    }



    handleRateAppend = async () => {

        try{

            this.props.engageApp(true);
    
            const data = {ref: this.state.coin_ref, label: this.state.rate_label, mineRate: this.state.mine_rate, minHashPower: this.state.min, maxHashPower: this.state.max};
            
            if( data.label.length < 1  ){
                throw { status: 400, message: "Some fields are empty" };
            }

            await this.props.editOrAddRate(data);
            const serverRes = this.props.editOrAddACoinRateReceipt;

            console.log(serverRes.data);

            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
 
            toastr.success(serverRes.data.message);
            this.getRates();
            
            this.setState({   
                rate_label: "",
                mine_rate: "",
                min: "",
                max: ""
            });

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

    getRates = async () => {
        try{

            if(getAuthority() != "ADMIN"){
                this.props.history.push('/start-mining');
            }
 
            $('#bodyClick').trigger('click');
            window.scrollTo(0, 0);

            this.props.engageApp(true);

            await this.props.fetchACoin(this.props.match.params.ref, this.source.token);
            const serverRes = this.props.aCoinReceipt;

            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
 
            console.log(serverRes.data.data);

            this.setState({rates: serverRes.data.data[0].coinRates, coin_name: serverRes.data.data[0].name,  coin_ref: this.props.match.params.ref });

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

            this.getRates();

        }catch(e){
           toastr.error(e.message);
        }
    }

    componentWillUnmount(){
        this.source.cancel();
    }

    render(){
        return (
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
                     
                        <p className="my-4">
                            <span style={ {fontSize: "1.8rem"} }><b> {this.state.coin_name} Rates  </b></span>
                            <span className="float-right"><Link to="/coin-management"> <i className="fas fa-reply text-success"></i> Go Back  </Link></span>
                        </p>
                            
                        
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-6 my-2">
                        <div className="py-3 white round">
                            <div className="row mb-3">
                                <div className="col-12 "> <h4 className="mt-0 mb-2"><b>Add Rate</b></h4> </div>
                            </div>

                            <div className="row">
                            
                                <form className="col-12 mt-3">

                                    <div className="form-group">
                                        <label>Label</label>
                                        <input type="text" required value={this.state.rate_label} onChange={ (e) => { this.setState({ rate_label: e.target.value }); } } placeholder="Label" className="form-control" />
                                    </div>

                                    <div className="form-group">
                                        <label>Mining rate(%)</label>
                                        <input type="number" required min="0" value={this.state.mine_rate} onChange={ (e) => { this.setState({ mine_rate: e.target.value }); } } placeholder="Mining rate" className="form-control" />
                                    </div>


                                    <div className="form-group">
                                        <label>Min hash power</label>
                                        <input type="text" required value={this.state.min} onChange={ (e) => { this.setState({ min: e.target.value }); } } placeholder="Hash Power unit" className="form-control" />
                                    </div>

                                    <div className="form-group">
                                        <label>Max hpower unit</label>
                                        <input type="text" required value={this.state.max} onChange={ (e) => { this.setState({ max: e.target.value }); } } placeholder="Hash Power unit" className="form-control" />
                                    </div>

                                </form>
                            </div>

                            <div className="row p-2 my-1">
                                <div className="col-12 col-lg-8 my-1"> 
                                    <button  disabled={this.props.appEngaged} onClick={this.handleRateAppend} className="btn btn-round btn-danger btn-block">
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
                                    this.state.rates.map( (r, i) => {
                                        
                                        return(
                                            <div key={i} className="card col-12" style={ {backgroundColor: "#eeeeee"} }>
                                                <div className="card-body">
                                                    <h6 className="author pull-left">{r.label}</h6>

                                                    <div className="clearfix"></div>
                                                    <p className="card-description text-truncate">
                                                        <span><b>Min</b>: { r.minHashPower }</span> - <span><b>Max</b>: { r.maxHashPower == 0 ? "UNLIMITED" : r.maxHashPower }</span>
                                                    </p>
                                                    <p className="card-description text-truncate">
                                                        <b>Mining @</b>: {r.mineRate}
                                                    </p>
                                                  
                                                </div>
                                            </div>
                                        );
                                    } )
                                }
                                
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
        aCoinReceipt: state.aCoinReceipt,
        editOrAddACoinRateReceipt: state.editOrAddACoinRateReceipt,
        editACoinReceipt: state.editACoinReceipt,
    };
}

export default connect(mapStateToProps, {  engageApp, unAuthorize, getCurrencies, updateACoin, fetchACoin, editOrAddRate })(CoinRate);