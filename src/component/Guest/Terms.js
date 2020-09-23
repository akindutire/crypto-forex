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
                <div className="page-header page-header-small" style={{ backgroundImage: "url('./img/sections/register.jpg')" }}>
                    <div className="filter"></div>
                    <div className="content-center">
                        <div className="container">
                            <h1>Terms and Conditions</h1>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="container">
                        {/* <h3 className="title-uppercase">We build great products.</h3> */}

                        <h4 className="title-uppercase">INTRODUCTION</h4>

                        <div className="container mt-1">Welcome to www.crypto-forex.me ("this Website"). The website features and the products and services published on this Website ("Services") are provided by Crypto Forex Group ("Crypto Forex"or"Us").By using our Services, you have acknowledged and agreed that:
                            <ul className="ul">
                                <li>You have complied with all the applicable laws and regulations in the applicable jurisdiction and；</li>
                                <li>You have read and agreed to these Conditions of Use. To the extent permissible by law, Crypto Forex reserves the right to alter these Conditions of Use at any time without providing notice. You are responsible for regularly checking for any changes to these Conditions of Use. Your continued use of this Website after any such changes are released shall be deemed as your acceptance of said changes. In addition to complying with the Conditions of Use, sometimes additional Service Terms may apply. (for example, when placing an order, you also will be subject to the order policy and terms and conditions). If these Conditions of Use are inconsistent with the Service Terms, those Service Terms will control.</li>
                            </ul>
                        </div>


                        <h4 className="title-uppercase">WEBSITE CONTENTS</h4>
                        <div className="container mt-1">All texts, images, music, videos, animations, trademarks, patterns, charts, visual interfaces and code (“Content”), including but not limited to the ideas, design, structure, expression, and display of the aforementioned Content, are legally owned, controlled, or legitimately authorized to be used by Crypto Forex. Unless otherwise stated in these Conditions of Use, you shall not use the Content on this website for any commercial purpose in any way without Crypto Forex prior written consent. You can download information presented on this website with regard to Crypto Forex products and services, provided that:
                            <ul className="ul">
                                <li> Said information is used solely for personal purposes and not for commercial purposes. </li>
                                <li>No alterations of any kind are made to said information. </li>
                                <li> No further statements and warranties shall be made with regard to said information or documents containing said information. 4. No statements and/or notifications indicating Crypto Forex ownership of and other legal rights and interests with regard to said information shall be removed, in part or in full.</li>
                            </ul>
                        </div>

                        <h4 className="title-uppercase">USAGE STANDARD</h4>
                        <div className="container mt-1">This Website cannot be used illegally or for any purpose prohibited in these Conditions of Use, nor can this Website and it's Content be used to infringe on the legal rights and interests of other persons or organizations.
                        You shall not use any form of device, program, or algorithm to access, obtain, copy, or monitor any part of this Website or its Content.
                        Additionally, you shall not visit, obtain, or copy any materials, documents, or information on this Website by any method not provided by this Website. You shall not attempt to illegally access, decode, or use any other illegal methods to gain unauthorized access to this Website, its Content, or its Services. You shall not trace, reverse lookup, decrypt, or decode any customer information on this Website, including but not limited to the ID's of users other than yourself.
                        You shall not violate any of the security mechanisms or authentication measures utilized by or linked to this Website. You shall not probe, scan, or otherwise test for any network weaknesses of this Website or those linked to it, nor launch any form of attack against it.
                        You agree not to use any device, software, or program to interfere or attempt to interfere with the regular operation of this Website or any transactions performed on this Website or to interfere or attempt to interfere with the use of this Website by others. You shall not undertake any actions that store unreasonable or disproportionate amounts of data on this Website's infrastructure, system, or network, or on systems or networks that are linked to this Website.
                        </div>


                        <h4 className="title-uppercase">ACCOUNT, PASSWORD AND SECURITY</h4>
                        <div className="container mt-1">You may need to register a Crypto Forex ID or log in to your Crypto Forex ID to access certain functions or services on this Website. By registering for a Crypto Forex account, you represent and warrant that you are a person who legally obtains the products or services offered by Crypto Forex under the laws of your jurisdiction.
                        You accept full responsibility for protecting the confidentiality of your account information, including your password. You accept full responsibility for any and all actions that occur on or against your account in the event that you fail to maintain the security and confidentiality of said information. If you find that your account has irregularities or abnormalities, including but not limited to the password being changed or the account being logged in to or used by unauthorized persons, you should notify
                        Crypto Forex immediately. If your failure to maintain the confidentiality of your account information leads to your account being used by others, which further leads to damages to Crypto Forex or other visitors to this website, you may be held liable for said damages. You shall not use other people's Crypto Forex ID's at any time without the express permission of the account holder. If your failure to comply with this clause leads to personal damage or loss to yourself or others, Crypto Forex will not assume responsibility for said losses.</div>

                        <h4 className="title-uppercase">SANCTIONS AND EXPORT QUALITY</h4>
                        <div className="container mt-1">Crypto Forex does not engage in any transaction, directly or indirectly, with a sanctioned country, region or person, or participate in any transaction involving a sanctioned country, region or person. You may not use any Crypto Mining products and service if you are the subject of U.S. sanctions or of sanctions consistent with U.S. law imposed by the governments of the country where you are located. You must comply with all U.S. or other export and reexport restrictions that may apply to goods, software, technology, and services.
                        </div>


                        <h4 className="title-uppercase">PRODUCT SUPPLY</h4>
                        <div className="container mt-1">The products, service and related descriptions displayed on this Website may be different in different countries and regions. If you need specific product or service information, please contact our customer service staff.
                        </div>

                        <h4 className="title-uppercase">DISCLAIMER</h4>
                        <div className="container mt-1">ALL THE CONTENTS OF THIS WEBSITE IS ONLY AVAILABLE FOR YOUR CONVENIENT USE. Crypto Forex DOES NOT GUARANTEE THE AVAILABILITY, CONTINUITY, AND ACCESSIBILITY OF THIS WEBSITE, ITS CONTENT, OR ITS SERVICES. THIS WEBSITE AND ITS CONTENT ARE PROVIDED ON AN 'AS IS' BASIS. YOU, AS THE USER, BEAR ALL RESPONSIBILITIES FOR USAGE OF THIS WEBSITE AND ANY WEBSITE LINKED TO IT. SHOULD YOU FEEL DISSATISFIED WITH ALL OR ANY PART OF THIS WEBSITE, YOUR ONLY COURSE OF REMEDIAL ACTION IS TO STOP USING ALL OR PART OF THIS WEBSITE, AS LIMITATION OF REMEDIES CONSTITUTES PART OF YOUR AGREEMENT WITH Crypto Forex WITH REGARD TO USAGE OF THIS WEBSITE. INFORMATION PUBLISHED ON THIS WEBSITE REGARDING TYPES OF PRODUCTS AND SERVICES AVAILABLE, INCLUDING BUT NOT LIMITED TO PRODUCT FUNCTIONS, CONFIGURATIONS, PARAMETERS, TECHNICAL STANDARDS, AND SERVICE CONTENT, MAY DIFFER BASED ON COUNTRY OR REGION. THE FUNCTIONS, CONFIGURATIONS, PARAMETERS, AND TECHNICAL STANDARDS OF ANY GIVEN PRODUCT MAY BE ADJUSTED AT DIFFERENT STAGES OF THAT PRODUCT'S LIFE CYCLE, AND IT MAY TAKE SOME TIME FOR Crypto Mining TO UPDATE THE CORRESPONDING INFORMATION. THEREFORE, THERE MAY BE SOME VARIATIONS BETWEEN THE PRODUCT AND SERVICE INFORMATION YOU SEE ON THIS WEBSITE AND THE ACTUAL PRODUCT YOU PURCHASE OR PRODUCTS FOR SALE IN YOUR MARKET. Crypto Forex DOES NOT GUARANTEE THE CORRECTNESS, COMPLETENESS, OR RELIABILITY OF THE CONTENT OF THIS WEBSITE.
                        </div>

                        <h4 className="title-uppercase">LIMITATION OF LIABILITIES</h4>
                        <div className="container mt-1">IN NO EVENT WILL Crypto Forex AND ITS AFFILIATES BE LIABLE TO YOU FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES (INCLUDING DAMAGES FOR LOSS OF PROFITS, GOODWILL, OR ANY OTHER INTANGIBLE LOSS) ARISING OUT OF OR RELATING TO YOUR ACCESS TO OR USE OF, OR YOUR INABILITY TO ACCESS OR USE, THE SITE, OR ANY MATERIALS, OR USER CONTENT AVAILABLE THROUGH THE SITE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT ANY DJI ENTITY HAS BEEN INFORMED OF THE POSSIBILITY OF DAMAGE.IF YOUR USE OF THIS WEBSITE RESULTS IN ANY FORM OF DAMAGE OR LOSS, THE COMPLETE AND MAXIMUM LIABILITY THAT Crypto Forex AND ITS AFFILIATES ASSUME SHALL NOT EXCEED THE TOTAL SUM OF ANY SUBSCRIPTION FEES OR SIMILAR FEES RELATED TO YOUR USE OF THE SERVICES OR FUNCTIONS OF THIS WEBSITE.
                        </div>

                        <h4 className="title-uppercase">EXTERNAL LINKS</h4>
                        <div className="container mt-1">This Website may contain links to independent third-party websites. Such links are provided only for the convenience of visitors to this Website. Crypto Forex does not give any express or implied guarantees regarding the Content, services, and information provided on linked websites, nor should these links be deemed as a recommendation or authorization by Crypto Forex with regard to the linked websites. You can visit any and all of the linked websites entirely at your own discretion, however Crypto Mining shall assume no responsibility for the outcome of any such interactions.
                        </div>


                        <h4 className="title-uppercase">BREACH OF THESE CONDITIONS OF USE</h4>
                        <div className="container mt-1">You agree that Crypto Forex reserves the rights to terminate your access to this Website and/or block you from visiting this Website in the event that Crypto Forex deems you to have breached any of these Conditions of Use. If Crypto Forex revokes your access to this Website as a result of you having breached these Conditions of Use, Crypto Forex assumes no liability towards you or any third-party. You agree that Crypto Forex can solely decide, without prior notification, to terminate your access to all or part of this Website's functions, for reasons including but not limited to:
                            <ul className="ul">
                                <li>In response to the requests of law enforcement agencies or other government institutions.</li>
                                <li>In response to your own request. (i.e. you request the deletion of your Crypto Forex ID.)</li>
                                <li>The suspension or major modification of this Website or any of its services.</li>
                                <li>Unforeseeable technical issues.</li>
                            </ul>
                        </div>


                        <h4 className="title-uppercase">APPLICABLE LAWS AND DISPUTE JURISDICTION</h4>
                        <div className="container mt-1">These Conditions of Use shall be interpreted and enforced according to the laws of Existing location of the facility. (Unless otherwise provided in the Service Terms). Any and all disputes arising out of the Conditions of Use shall be amicably resolved by both Parties. Both parties agree to submit the dispute which cannot be amicably settled to arbitration. The arbitration shall be submitted to Hong Kong International Arbitration Center in accordance with UNCITRAL Arbitration Rules (“UNCITRAL Rules”) in effect before one arbitrator to be appointed according to the UNCITRAL Rules. The decision and awards of the arbitration shall be final and binding upon the parties hereto. (Unless otherwise provided in the Service Terms)
                        </div>

                        <h4 className="title-uppercase">SITE POLICIES, MODIFICATION AND SEVERABILITY</h4>
                        <div className="container mt-1">Please review our other policies posted on this Website. These policies also govern your use of our Services. We reserve the right to make changes to our site, policies, Service Terms, and the Conditions of Use at any time. If any of these conditions shall be deemed invalid, void, or for any reason unenforceable, that condition shall be deemed severable and shall not affect the validity and enforceability of any remaining condition.
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