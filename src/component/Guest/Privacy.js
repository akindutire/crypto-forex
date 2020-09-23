import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import $ from 'jquery';

import { connect } from "react-redux";

import { navShouldBeTransapent } from './../../redux/action/PageAct';

class Terms extends Component {

    componentDidMount() {
        // this.props.navShouldBeTransapent();
        $('#bodyClick').click();
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <main>
                <div className="page-header page-header-small" style={{ backgroundImage: "url('./img/sections/privacy.jpg')" }}>
                    <div className="filter"></div>
                    <div className="content-center">
                        <div className="container">
                            <h1>Privacy</h1>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="container">
                        {/* <h3 className="title-uppercase">We build great products.</h3> */}

                        <h4 className="title-uppercase">PRIVACY</h4>
                        <div>This Website is subject to Crypto Forex Privacy Policy, the details of which can be viewed on this Website. It should be noted that the network link and data transmitted between yourself and this Website are neither completely safe nor confidential, and it is possible that information and data you send to this website could be intercepted by others. Crypto Forex is unable to guarantee the security and confidentiality of the network link and data transmitted between yourself and this Website.</div>

                        <h4 className="title-uppercase">RESERVATION OF RIGHTS</h4>
                        <div className="container my-1">Crypto Forex reserves the right to perform the following actions at any time without giving notice:
                            <ul className="ul">
                                <li>Suspend or terminate operation of, or access to, all or part of this Website at any time, irrespective of the reason. </li>
                                <li>Fix or alter all or part of the Content of this Website as well as any applicable policies, terms, or clauses.</li>
                                <li>Suspend operation of all or part of the Website for the purposes of maintenance, alteration of errors, or other such changes at regular or irregular intervals.</li>
                            </ul>
                        </div>

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

export default connect(mapStateToProps, { navShouldBeTransapent })(Terms);