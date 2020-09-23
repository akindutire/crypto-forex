import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Nav extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const navBg = this.props.shouldNavBeTransparent ? 'navbar-transparent' : 'navbar-light';
        const navToggler = this.props.shouldNavBeTransparent ? 'text-light' : 'text-dark';

        return (
            <div className="row sticky-top">
                <div className="col-12 p-0">
                    <nav className={`navbar navbar-expand-lg nav-down navbar-absolute ${navBg}`} style={{ paddingTop: '0px' }}>
                        <div className="container">
                            <div className="navbar-translate">
                                <Link className="navbar-brand" to="/" rel="tooltip" title="Crypto forex" data-placement="bottom">
                                    <img src="./img/demo/logoM.jpg" height="40px" alt="..." />
                                </Link>
                                <button className="navbar-toggler mr-3" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className=""><i className={`fas fa-bars ${navToggler}`}></i></span>
                                </button>
                            </div>
                            <div
                                className="collapse navbar-collapse d-none d-md-none d-lg-none d-xl-none d-sm-block d-xs-block" data-nav-image="" style={{ paddingLeft: '15px' }} id="navigation">
                                <ul className="navbar-nav ml-auto">
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login" aria-expanded="false">
                                            Login
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register" aria-expanded="false">
                                            Register
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <ul className="navbar-nav ml-auto d-none d-lg-flex">
                                {/* <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="https://bootstrapthemes.co/" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Multilevel Dropdown
                                    </a>
                                    <ul className="dropdown-menu dropdown-danger" aria-labelledby="navbarDropdownMenuLink">
                                    <a className="dropdown-item" href="#">Action</a>
                                    <a className="dropdown-item" href="#">Another action</a>
                                    <a className="dropdown-item dropdown-toggle" href="#">Submenu</a>
                                    <ul className="dropdown-menu">
                                        <a className="dropdown-item" href="#">Submenu action</a>
                                        <a className="dropdown-item" href="#">Submenu action</a>
                                        <a className="dropdown-item dropdown-toggle" href="#">Subsubmenu</a>
                                        <ul className="dropdown-menu dropdown-danger">
                                        <a className="dropdown-item" href="#">Subsubmenu action 1</a>
                                        <a className="dropdown-item" href="#">Subsubmenu action 2</a>
                                        </ul>
                                        <li><a className="dropdown-item dropdown-toggle" href="#">Second subsubmenu</a>
                                        <ul className="dropdown-menu dropdown-danger">
                                            <a className="dropdown-item" href="#">Subsubmenu action 1</a>
                                            <a className="dropdown-item" href="#">Subsubmenu action 2</a>
                                        </ul>
                                        </li>
                                    </ul>
                                    </ul>
                                </li> */}
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login" aria-expanded="false">
                                        Login
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/register" aria-expanded="false">
                                        Register
                                    </Link>
                                </li>


                                {/* <li className="dropdown nav-item">
                                <a href="#" className="dropdown-toggle nav-link" data-toggle="dropdown" aria-expanded="false">
                                Components </a>
                                <div className="dropdown-menu dropdown-menu-right dropdown-danger">
                                <a href="../index-2.html" className="dropdown-item">
                                    All Components
                                </a>
                                <a href="docs/2.0/getting-started/introduction.html" className="dropdown-item">
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

export default connect(mapStateToProps, {})(Nav);