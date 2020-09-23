import React, { Component } from 'react';

import PageNotFound from '../../svg/PageNotFound.svg';
import { footerShouldBeFixed, navShouldBeTransapent } from './../../redux/action/PageAct';
import { connect } from 'react-redux';
import $ from 'jquery';

class NotFound extends Component{

    constructor(props){
        super(props);
    }

    componentDidMount(){
        $('#bodyClick').click();
        window.scrollTo(0, 0);
    }

    render(){
        return(
            <>
                <div className="row" style={ {marginTop: "5rem", height:"auto", minHeight:"500px"} }>
                    
                    <img className="col-xs-12 col-sm-12 col-md-8 col-lg-6 mx-auto my-auto px-4" src={PageNotFound} alt="Page not found"/>
                    <p className="col-12 text-center">

                        <button type="button" className="btn btn-success btn-lg mr-3" onClick={ () => {  this.props.authState ?  this.props.history.push('/start-mining') : this.props.history.push('/');  } }>Go Home</button>
                        <button type="button" className="btn btn-danger btn-lg" onClick={ () => {  this.props.history.goBack();  } }>Go back</button>

                    </p>
                </div>
             
            </>
        );
    }
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        authState: state.authState
    };
}

export default connect(mapStateToProps, {footerShouldBeFixed, navShouldBeTransapent})(NotFound);