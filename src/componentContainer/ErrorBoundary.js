import React, {Component} from 'react';
import SomethingWentWrong from '../svg/SomethingWentWrong.svg';

class ErrorBoundary extends Component {

    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
    //   logErrorToMyService(error, errorInfo);
        console.log(errorInfo, error);
    }
  
    render() {
            return(
                <>
                { this.state.hasError ? 

                    <div className="row" style={ {marginTop: "5rem", height:"auto", minHeight:"500px"} }>
                        
                        <img className="col-xs-12 col-sm-12 col-md-8 col-lg-6 mx-auto my-auto px-4" src={SomethingWentWrong} alt="Something went wrong"/>
                        <p className="col-12 text-center">Something went wrong</p>
                       
                    </div>
                :
                    this.props.children 
                }
                </>
            );
       
  
    }
}

export default ErrorBoundary;