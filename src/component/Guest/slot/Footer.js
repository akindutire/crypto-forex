import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Footer extends Component {


    render(){
        const fooFix = this.props.shouldFooterBeFixed ? 'fixed-bottom' : ''

        return(
            <footer className={`footer footer-black footer-white ${fooFix}`} style={ {position: this.props.shouldFooterBeFixed ? 'fixed' : 'relative', backgroundColor: "#151f20"} }>
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            <ul className="d-inline text-center">
                                <li className="d-inline-block p-1"><Link style={{color:"#ffffff"}} to="/">Home</Link> </li>
                                <li className="d-inline-block p-1"><a style={{color:"#ffffff"}} href="https://t.me/cryptoforex_2020" target="_blank">Our Telegram</a></li>
                                <li className="d-inline-block p-1"><Link style={{color:"#ffffff"}} to="/terms">Terms and Conditions</Link></li>
                                <li className="d-inline-block p-1"><Link style={{color:"#ffffff"}} to="/about">About Us</Link></li>
                                <li className="d-inline-block p-1"><Link style={{color:"#ffffff"}} to="/faq">FAQs</Link></li>
                                <li className="d-inline-block p-1"><Link style={{color:"#ffffff"}} to="/privacy">Privacy</Link></li>
                            </ul>
                        </div>

                        <div className="col-12 text-center">
                            <ul className="d-inline text-center">
                                
                                <li className="d-inline-block p-1"> 
                                    <a href="https://www.facebook.com/cryptoforex.2020" className="btn btn-link text-muted" target="_blank">
                                        <i className="fab fa-facebook"></i> Visit our facebook page
                                    </a> 
                                </li>
                               
                            </ul>
                        </div>

                        <div className="col-12 text-center credits">
                            <span className="copyright text-light">
                                &copy; <b>2020 Crypto forex</b>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
    
}

const mapStateToProps = (state) => {
    return {
        shouldFooterBeFixed: state.shouldFooterBeFixed
    }
}

export default connect(mapStateToProps,{})(Footer);