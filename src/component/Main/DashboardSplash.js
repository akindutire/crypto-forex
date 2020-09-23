import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import $ from 'jquery';
import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';

import { getAuthority } from './../../redux/service/FxApi';

import { unAuthorize } from './../../redux/action/AuthAct';
import {  engageApp } from './../../redux/action/PageAct';
import {  selectCoinToMine, getMinableCoins } from './../../redux/action/CoinAct';

import { connect } from 'react-redux';
import axios from 'axios';


class DashboardSplash extends Component{
    cancelToken = axios.CancelToken;
    source = this.cancelToken.source();

    constructor(props){
        super(props);

        this.state = {
            paymentState : "",
            minableCoin: [],
            loading: true,
        }

        this.selectACoin = this.selectACoin.bind(this);
    }

    selectACoin = async (data) => {

        //data:coin
        await this.props.selectCoinToMine(data);
        if(this.props.coinSelected.ref.length > 0){
            this.props.history.push('/dashboard');
        }else{
            toastr.error("Couldn't select a coin");
        }
    }

    async componentDidMount(){
        try{
 
            $('#bodyClick').trigger('click');
            window.scrollTo(0, 0);
    
            await this.props.getMinableCoins(this.source.token);
            const serverRes = this.props.minableCoin;

            // console.log(serverRes);

            if(serverRes.status !== 200){
                throw { status: serverRes.status, message: serverRes.data  }
            }
 
            this.setState({minableCoin: serverRes.data.data, loading: false});

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

                <div className="row" style={{ marginTop: "4.5rem", paddingBottom: "4.5rem", height: "auto", minHeight: "550px" }}>

                    <div className="col-12 mb-2 mt-4">

                        <h3 className="text-center">
                            <b> Choose a coin to mine </b><hr className="my-1" style={ {width: "2.5rem", borderBottom: "4px solid #283593"} }/>
                        </h3>
                        {/* <p className="text-center">lorem</p> */}

                    </div>


                    <div className="col-xs-12 col-sm-12 col-md-6 mx-auto mb-2">
                        <div className="py-3 white round">
                      
                            <div className="row">
                                {
                                    this.state.loading ?
                                        
                                        <p className="d-block w-100 text-center" style={ {display: this.state.loading ? 'block' : 'none'} }>
                                            <img src="/svg/Loader.svg" width="20%"/>
                                        </p>
                                    
                                    : 
                                    <>
                                        <ul id="dashboardSplashList" className="list-group d-block w-100" style={ { display: this.state.minableCoin.length > 0 ? 'block' : 'none'} }>
                                            {
                                                this.state.minableCoin.length > 0 ? 
                                                    this.state.minableCoin.map( (coin, i) => {
                                                        return (
                                                            <li onClick={ () => {this.selectACoin(coin); } } key={i} className="list-group-item d-flex justify-content-between align-items-center" style={{border: "0px", borderBottom:"1px solid #e8eaf6", cursor: "pointer", fontSize:"0.9rem"}}>
                                                                {coin.name}
                                                                <span className="badge badge-primary badge-danger">{coin.currency}</span>
                                                            </li>        
                                                        )
                                                    })
                                                :
                                                    null  
                                            }

                                        </ul>

                                        <p className="w-100 text-center" style={ {display: this.state.minableCoin.length > 0 ? 'none' : 'block', fontSize:"2rem"} }>

                                            No minable coin
                                        </p>
                                    </>      

                                }

                                {
                                    getAuthority() === "ADMIN" ?
                                        <Link to="/coin-management" className=" col-md-10 col-lg-4 col-sm-12 mx-auto btn btn-warning">Coin management</Link>
                                    :
                                        null
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
        minableCoin: state.minableCoin,
        coinSelected: state.coinSelected,
    };
}

export default connect(mapStateToProps, {  engageApp, unAuthorize, selectCoinToMine, getMinableCoins })(DashboardSplash);