import React,{Component} from "react";
import Header from "../slot/Header";
import Content from "./Content";
import { connect } from "react-redux";
import $ from 'jquery';

import { navShouldBeTransapent } from './../../../redux/action/PageAct';

class Landing extends Component{

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.navShouldBeTransapent(false);
        $('#bodyClick').click();
        window.scrollTo(0, 0);
    }

    render(){
        return(
            <main className="">
                
                <Header />
                <Content />
                
            </main>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        shouldNavBeTransparent: state.shouldNavBeTransparent
    }
}

export default connect(mapStateToProps,{navShouldBeTransapent})(Landing);
