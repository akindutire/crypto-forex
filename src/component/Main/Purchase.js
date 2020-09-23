import React, { Component } from 'react';

import $ from 'jquery';

import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';

import { unAuthorize } from './../../redux/action/AuthAct';
import { engageApp, setHashPowerToPurchase } from './../../redux/action/PageAct';


import { connect } from 'react-redux';


class Purchase extends Component {

    
    MinimumDeposits = {
        BTC: 0.00090,
        ETH: 0.026,
        LTC: 0.21,
        DOGE: 3.670,
        ZEC: 0.17,
        DASH: 0.14
    };
    

    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            purchase_hash_power: 0,
            purchase_crypto_amount: 0, 
            cur_coin: []
        };
     
        this.handlePurchase = this.handlePurchase.bind(this);
    }

    handlePurchase = () => {
        try{

            if(this.state.purchase_crypto_amount < this.MinimumDeposits[this.props.coinSelected.currency]){
                throw {status: 400, message: "Minimum amount deposit has been reached"};
            }

            this.props.setHashPowerToPurchase({h: this.state.purchase_hash_power, ad: undefined});
            this.props.history.push(`/pay`);

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

    componentDidMount() {

        $('#bodyClick').trigger('click');
        window.scrollTo(0, 0);

        if(typeof this.props.coinSelected.ref === "undefined"){
            this.props.history.push('/start-mining');
            return;
        }else{
            this.setState({cur_coin: this.props.coinSelected})
        }

        
    }

    render() {
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

                <div className="row" style={{ marginTop: "4.5rem", paddingBottom: "4.5rem", height: "auto", minHeight: "550px" }}>

                    <div className="col-12 mb-4">

                        <h2 className="text-center">
                            <b> Purchase </b><hr className="my-1" style={ {width: "2.5rem", borderBottom: "4px solid #283593"} }/>
                        </h2>

                    </div>


                    <div className="col-xs-12 col-sm-12 col-md-6 mx-auto mb-2">
                        <div className="py-3 white round">
                      
                            <div className="row">
                                <form className="col-12 mt-3">
                                    
                                    <div className="form-group">
                                        <label>Hash Power</label>
                                        <input type="number" value={this.state.purchase_hash_power} onChange={ (e) => { this.setState({ purchase_hash_power:e.target.value, purchase_crypto_amount: e.target.value/this.state.cur_coin.exchangeRateToHashPower }); } } placeholder="Hash Power" className="form-control" />
                                    </div>

                                    <div className="form-group">
                                        <label>Amount to be paid({this.state.cur_coin.currency})</label>
                                        <input type="number" value={this.state.purchase_crypto_amount} onChange={ (e) => { this.setState({ purchase_crypto_amount: e.target.value, purchase_hash_power: e.target.value*this.state.cur_coin.exchangeRateToHashPower}); this.calculateDailyReturns(e.target.value) } }   placeholder="Amount" className="form-control" />
                                    </div>

                                    <div className="row p-2">
                                        <div className="d-block mx-auto text-center">
                                            <span>Minimum deposit: <b>{this.MinimumDeposits[this.props.coinSelected.currency]}</b> <b className="text-success">{this.props.coinSelected.currency}</b></span>
                                        </div>
                                    </div>
                                    
                                </form>
                            </div>
                            
                      
                            <div className="row p-2 my-3">
                                <div className="col-12 my-1"> 
                                    <button disabled={this.props.appEngaged || this.state.purchase_crypto_amount == 0} onClick={this.handlePurchase} className="btn btn-round btn-danger btn-block">
                                        { this.props.appEngaged ? 'Processing' : 'Proceed' }
                                    </button>
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
    };
}

export default connect(mapStateToProps, { setHashPowerToPurchase, engageApp, unAuthorize })(Purchase);