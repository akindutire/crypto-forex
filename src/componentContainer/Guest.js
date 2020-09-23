import React from 'react';

import { Route, Redirect } from 'react-router-dom';
import Nav from '../component/Guest/slot/Nav';
import Footer from '../component/Guest/slot/Footer';
import ErrorBoundary from './ErrorBoundary';

export const Guest = ({component: Component, ...rest}) => {

        return(
            <ErrorBoundary>

                <Route  
                    {...rest} 
                    render={
                        (props) => {
                        
                                return <>
                                    <Nav/> 
                                    <Component {...props} /> 
                                    <Footer /> 
                                </>   
            
                        }
                    }
                    
                />
            </ErrorBoundary>

    );

}

