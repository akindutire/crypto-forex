import React, { Component } from 'react';
import { connect } from "react-redux";
import $ from 'jquery';

import { navShouldBeTransapent } from './../../redux/action/PageAct';

class About extends Component {

    componentDidMount(){
        // this.props.navShouldBeTransapent();
        $('#bodyClick').click();
        window.scrollTo(0, 0);
    }

    render(){
        return(
            <main>
                <div className="page-header page-header-small" style={ { backgroundImage: "url('./img/sections/about.jpg')" } }>
                    <div className="filter"></div>
                    <div className="content-center">
                        <div className="container">
                            <h1>Hello, <br /> We are Crypto Forex</h1>
                            <h3>We grow your coin</h3>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="container">
                        {/* <h3 className="title-uppercase">We build great products.</h3> */}

                        {/* <h3 className="title-uppercase">We <i className="fa fa-heart heart"></i>&nbsp; what we do.</h3> */}
                       
                        <p className="text-center">Crypto Forex Ltd works to provide its investors with the best and safest experience in the world of competitive cloud mining and forex trading. It invests heavily in cutting-edge technology and the ecosystem to
make forex trading, mining and blockchain technologies accessible and understandable to everyone.</p>
                        
                        <p className="text-center">The company is a cryptocurrency and forex trading international investment company with an impeccable reputation. It does not only provide it's investors a competitive high return on investment, but also maximum confidentiality and security with an unrivaled level of customer service.</p>
                      
                        <p className="text-center">The platform's flexibility is also designed for users to maximize their returns. One year secure contract, with high return rates, along with the portfolio making feature in mining and trading, distinguishes Crypto Forex Ltd from competing platforms.</p>

                     
                    </div>
                </div>
            </main>
        );
    }
 
}

const mapStateToProps = (state) => {
    return {
        shouldNavBeTransparent: state.shouldNavBeTransparent
    }
}

export default connect(mapStateToProps,{navShouldBeTransapent})(About);

