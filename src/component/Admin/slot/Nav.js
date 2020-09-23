import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { unAuthorize } from './../../../redux/action/AuthAct';

class Nav extends Component {

    constructor(props) {
        super(props);
    
        this.handleLogout = this.handleLogout.bind(this);    
    }

    handleLogout = () => {
        
        sessionStorage.removeItem("$_ORG+=.*653-CR653-CRY15_FX_WJ1193339425_FX_WJT_KOTNE.98193339425$COIN_TO_MINE");
        this.props.unAuthorize();
       
    }

    render() {
        
        const navBg = this.props.shouldNavBeTransparent ? 'navbar-transparent' : 'navbar-dark bg-dark navbar-crypto';
        const navToggler = this.props.shouldNavBeTransparent ? 'text-light' : 'text-light'

        return (
            <div className="row sticky-top">
                <div className="col-12 p-0">
                    <nav className={`navbar navbar-expand-lg nav-down navbar-absolute ${navBg}`} style={{ paddingTop: '0px' }}>
                        <div className="container">
                            <div className="navbar-translate">
                                <Link className="navbar-brand" to="/coin-management" rel="tooltip" title="Crypto forex" data-placement="bottom">
                                    Crypto forex
                                </Link>
                                <button className="navbar-toggler mr-3" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className=""><i className={`fas fa-bars ${navToggler}`}></i></span>
                                </button>
                            </div>
                            <div
                                className="collapse navbar-collapse d-none d-md-none d-lg-none d-xl-none d-sm-block d-xs-block" data-nav-image="" style={ {paddingLeft: '15px'} } id="navigation">
                                <ul className="navbar-nav ml-auto">
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/coin-management" aria-expanded="false">
                                            Home
                                        </Link>
                                    </li>

                                    {/* <li className="nav-item">
                                        <Link className="nav-link" to="/mgt-contracts" aria-expanded="false">
                                             Contracts
                                        </Link>
                                    </li> */}

                                    {/* <li className="nav-item">
                                        <Link className="nav-link" to="/mgt-transactions" aria-expanded="false">
                                             Transactions
                                        </Link>
                                    </li> */}

                                    <li className="nav-item">
                                        <Link className="nav-link" to="/mgt-users" aria-expanded="false">
                                             Users
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link className="nav-link" to="/mgt-withdrawal-requests" aria-expanded="false">
                                            Withdrawal Request
                                        </Link>
                                    </li>

                                    {/* <li className="nav-item">
                                        <Link className="nav-link" to="/mgt-stats" aria-expanded="false">
                                             Stats
                                        </Link>
                                    </li> */}

                                    <li className="nav-item">
                                        <a className="nav-link" href="#" onClick={this.handleLogout} aria-expanded="false">
                                            <i className="fas fa-sign-out-alt"></i> Logout
                                        </a>
                                    </li>

                                </ul>
                            </div>

                            <ul className="navbar-nav ml-auto d-none d-lg-flex">
                               
                                <li className="nav-item">
                                    <Link className="nav-link" to="/coin-management" aria-expanded="false">
                                         Home
                                    </Link>
                                </li>

                                {/* <li className="nav-item">
                                    <Link className="nav-link" to="/mgt-contracts" aria-expanded="false">
                                        <i className="fas fa-layer-group"></i> Contracts
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/mgt-transactions" aria-expanded="false">
                                        <i className="fas fa-share"></i> Transactions
                                    </Link>
                                </li> */}

                                <li className="nav-item">
                                    <Link className="nav-link" to="/mgt-users" aria-expanded="false">
                                         Users
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/mgt-withdrawal-requests" aria-expanded="false">
                                         Withdrawal Request
                                    </Link>
                                </li>

                                {/* <li className="nav-item">
                                    <Link className="nav-link" to="/mgt-stats" aria-expanded="false">
                                        <i className="fas fa-cog"></i> Stats
                                    </Link>
                                </li> */}

                                <li className="nav-item">
                                    <a className="nav-link" href="#" onClick={this.handleLogout} aria-expanded="false">
                                        <i className="fas fa-sign-out-alt"></i> Logout
                                    </a>
                                </li>

                                {/* <li className="dropdown nav-item">
                                <a href="#" className="dropdown-toggle nav-link" data-toggle="dropdown" aria-expanded="false">
                                Components </a>
                                <div className="dropdown-menu dropdown-menu-right dropdown-danger">
                                <a href="index-2" className="dropdown-item">
                                    All Components
                                </a>
                                <a href="" className="dropdown-item">
                                    Documentation
                                </a>
                                </div>
                                </li> */}

                            </ul>


                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        shouldNavBeTransparent: state.shouldNavBeTransparent
    }
}

export default connect(mapStateToProps,{unAuthorize})(Nav);