import React from 'react';

import { Link } from 'react-router-dom';

const Header = (props) => {
    return(
        <div className="page-header" data-parallax="true" style={ {backgroundImage: "url('/img/sections/home.jpg')" } } >
            <div className="filter"></div>
            <div className="content-center">
                <div className="container">
                    <div className="motto">
                        <h1 className="title">Grow your coins</h1>
                        <h3 className="description"></h3>
                        
                        <p className="description mt-3">
                            Forex is a financial market where trades worth billions of dollars take place every day. it is a great opportunity for traders from all over the world to invest in the stock market and earn through online trading. <br />Luckily, this platform provides you with the opportunity to trade and mine simultaneously. Earn <b>3.5% profit daily</b> with zero withdrawal fees.
                        </p>

                        <br />
                        <a href="https://t.me/cryptoforex_2020" className="btn btn-neutral btn-round mr-1 my-1" target="_blank"><i className="fab fa-telegram"></i> Join our Telegram</a>
                        <Link to="/register" className="btn btn-outline-neutral btn-round my-1">Get Started</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Header;