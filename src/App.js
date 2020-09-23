import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Landing from './component/Guest/landing/Landing';
import NotFound from './component/Guest/NotFound';
import { connect } from 'react-redux';
import { Secure } from './componentContainer/Secure';
import { Guest } from './componentContainer/Guest';
import About from './component/Guest/About';
import Terms  from './component/Guest/Terms';
import Login from './component/Guest/Login';
import MFAConfirmation from './component/Guest/MFAConfirmation';
import Register from './component/Guest/Register';
import ResetPassword from './component/Guest/ResetPassword';
import Dashboard from './component/Main/Dashboard';
import Withdraw from './component/Main/Withdraw';
import Purchase from './component/Main/Purchase';
import DashboardSplash from './component/Main/DashboardSplash';
import PayForHashPower from './component/Main/PayForHashPower';
import Privacy from './component/Guest/Privacy';

import CoinManagement from './component/Admin/CoinManagement';
import CoinRate from './component/Admin/CoinRate';
import { Admin } from './componentContainer/Admin';
import Contracts from './component/Main/Contracts';
import Profile from './component/Main/Profile';
import TransactionHistory from './component/Main/TransactionHistory';
import WithdrawalRequests from './component/Admin/WithdrawalRequests';
import Faq from './component/Guest/Faq';


class App extends Component {
  
  constructor(props){
  
    super(props);
  
  }

  render(){
    return(

      <Router>
  
        <Switch>
  
          <Guest path="/" exact component={Landing} />

          <Guest path="/about" exact component={About} />

          <Guest path="/terms" exact component={Terms} />

          <Guest path="/login" exact component={Login} />

          <Guest path="/mfa-verification" exact component={MFAConfirmation} />

          <Guest path="/register" exact component={Register} />
          
          <Guest path="/register/:referral" exact component={Register} />
  
          <Guest path="/reset/:token" exact component={ResetPassword} />

          <Guest path="/privacy" exact component={Privacy} />

          <Guest path="/faq" exact component={Faq} />

          <Secure path="/start-mining" exact component={DashboardSplash} authState={this.props.authState} /> 

          <Secure path="/dashboard" exact component={Dashboard} authState={this.props.authState} /> 

          <Secure path="/profile" exact component={Profile} authState={this.props.authState} /> 

          <Secure path="/withdraw" exact component={Withdraw} authState={this.props.authState} /> 

          <Secure path="/transactions" exact component={TransactionHistory} authState={this.props.authState} /> 

          <Secure path="/purchase" exact component={Purchase} authState={this.props.authState} /> 

          <Secure path="/pay" exact component={PayForHashPower} authState={this.props.authState} /> 

          <Secure path="/contracts" exact component={Contracts} authState={this.props.authState} /> 



          {/* ================ADMIN========================== */}
          <Admin path="/coin-management" exact component={CoinManagement} authState={this.props.authState} /> 
          <Admin path="/rate/:ref" exact component={CoinRate} authState={this.props.authState} /> 

          <Admin path="/mgt-users" exact component={CoinManagement} authState={this.props.authState} /> 
          {/* <Admin path="/mgt-contracts" exact component={CoinManagement} authState={this.props.authState} /> 
          <Admin path="/mgt-transactions" exact component={CoinManagement} authState={this.props.authState} />  */}
          <Admin path="/mgt-withdrawal-requests" exact component={WithdrawalRequests} authState={this.props.authState} /> 
          {/* <Admin path="/mgt-stats" exact component={CoinManagement} authState={this.props.authState} />  */}


          <Route path="*" exact component={NotFound} />
  
        </Switch>
  
      </Router>
  
    );
  }
 
}

const mapStateToProps = (store) => {
  return {
    authState : store.authState
  }
}

export default connect(mapStateToProps,{})(App);
