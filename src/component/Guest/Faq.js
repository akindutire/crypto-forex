import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import $ from 'jquery';

import { connect } from "react-redux";

import { navShouldBeTransapent } from './../../redux/action/PageAct';

class Faq extends Component {

    componentDidMount() {
        // this.props.navShouldBeTransapent();
        $('#bodyClick').click();
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <main>
                <div className="page-header page-header-small" style={{ backgroundImage: "url('./img/sections/faq.jpg')" }}>
                    <div className="filter"></div>
                    <div className="content-center">
                        <div className="container">
                            <h1>Faq</h1>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="container">
                        {/* <h3 className="title-uppercase">We build great products.</h3> */}

                        <h4 className="title-uppercase">COMPANY INFORMATION</h4>

                        <div className="container mt-1"><b>Are you a registered company?</b> Yes, Crypto-Forex is an officially registered,UK-based cloudcrypto mining and ForexTrading initiative that prides itself on the security of its users. CRYPTO-FOREXLTDNr.:16682591; Verify 97,Thirsk Street Blashford BH243WT
                        
                        </div>


                        <h4 className="title-uppercase">ACCOUNT INFORMATION</h4>

                        <div className="container mt-1">
                            <b>How Do I Create a new account?</b><br />
                            <p className="container mb-1">
                                Opening a new Crypto-Forex account is easy. Just follow the directions to sign up, enter your details and quickly Fill the form with your chosen email and password.
                            </p>
                            <p className="container mb-1">
                                Once you have agreed to Crypto-Forex terms and conditions, you will receive a confirmation email asking you to verify your email address. If you do not receive a confirmation email, please check your spam folder and adjust your email settings to ensure you don’t miss out on exciting future opportunities reserved for our newsletter recipients.
                            </p>
                            <p className="container mb-1">
                                Once you have followed this, you will have access to your new Crypto-Forex account section and be able to begin enjoying the profitable world of Crypto-Forex!
                            </p>

                            <b>How can I Close down my account?</b><br />
                            <p className="container mb-1">Just get in touch with our friendly customer support team and let them know that you wish to terminate your account.</p>

                        </div>

                        <h4 className="title-uppercase">RETURNS INFORMATION</h4>
                        <div className="container mt-1">
                            <b>Can you tell me the expected returns?</b><br />
                            <p className="container mb-1">
                                Your expected return is 3.5% daily of your investment. This will sum up to a total of 105% return monthly
                            </p>

                            <b>How Long Will My Contract Last?</b><br />
                            <p className="container mb-1">
                                Each contract will last for the duration of 1 Year
                            </p>
                            
                            <b>Can I Make Investment Multiple Times?</b><br />
                            <p className="container mb-1">Yes, you can make Investment as many times as you want.</p>

                        </div>


                        <h4 className="title-uppercase">WALLET INFORMATION</h4>
                        <div className="container mt-1">
                            <b>What are the payment methods and limits by which you operate?</b><br />
                            <p className="container mb-1">
                            Crypto-Forex accepts payment methods include: Bitcoin, Litecoin, Doge, Zcash, Ethereum and Tron. <br/>
                            Other payment methods will be added soon
                                <ul className="ul">
                                    <li>Unlimited purchases per day.</li>
                                    <li>Unlimited purchases per week.</li>
                                    <li>Unlimited minimum purchase</li>
                                    <li>Unlimited transaction limit</li>
                                    <li>Unlimited daily/monthly purchase limit</li>
                                </ul>
                            </p>

                        </div>

                        <h4 className="title-uppercase">INVESTMENT INFORMATION</h4>
                        <div className="container mt-1">
                            <b>When Will I Get My Investment Output?</b><br />
                            <p className="container mb-1">
                                Usual investment output receipt time is 24 hours. Due to timezone overlaps and trading days running 00:00-23:59 UTC, please wait up to 48 hours to receive your initial investment input. For follow-up purchases, you can expect to receive your outputs each day.
                            </p>

                            <p className="container mb-1">
                                If, however, you have purchased a contract in a time of presale, you will receive your outputs at the time specified by the offer.
                            </p>
                            
                            <p className="container mb-1">
                                Please remember that outputs are automatically conducted every 24 hours but final withdraw occurs only once your account’s minimal withdrawal amounts have been met.
                            </p>

                            <p className="container mb-1">
                                Minimal transfer amounts have been met.
                            </p>

                            <b>In the past 24 hours I have not received any investment outputs</b><br />
                            <p className="container mb-1">
                                Occasionally investment outputs can be slightly delayed due to ongoing work by our team to boost your trading performance. Such platform fluctuation is normal and nothing to be concerned about with your asset security as our top priority.
                            </p>
                            <p className="container mb-1">
                                In the same manner, you might receive your daily investment outputs slightly quicker than 24 hours since the last receipt.
                            </p>

                            <b>What Happen If I Change My Wallet Address?</b><br />
                            <p className="container mb-1">
                                Simply head to your account section and check that your new wallet address is correct. If it is, and you have not received your outputs for any other reason, please reach out to our customer support.
                            </p>

                            <b>Can you explain how the affiliate program works?</b><br />
                            <p className="container mb-1">
                                The Crypto-Forex affiliate program could be another profitable means of getting higher output. It all begins with an affiliate code that is unique to your account. Whenever a user registers and inputs your referral code, they receive 5% discount on whatever purchase they make. And you enjoy a significant hash power boost.
                            </p>
                            <p className="container mb-1">
                                The more referrals you make, the higher your affiliate rank rises. And the higher your affiliate rank, the bigger hashpower boost you enjoy. It’s as simple and as profitable as that. We will be sure to remind you via your linked email whenever your referral code is used.
                            </p>


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

export default connect(mapStateToProps, { navShouldBeTransapent })(Faq);