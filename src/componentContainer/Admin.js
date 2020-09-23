import React from 'react';

import { Route,Redirect } from 'react-router-dom';
import Nav from '../component/Admin/slot/Nav';
import Footer from '../component/Guest/slot/Footer';
import ErrorBoundary from './ErrorBoundary';

export const Admin = ({component: Component, authState: isAuthenticated, ...rest}) => {

    return(
        <ErrorBoundary>
            <Route  
                {...rest} 
                render={
                    (props) => {
                        return isAuthenticated ?
                            (  
                                <>
                                    <Nav/> 
                                    <main style={ {height: "auto", minHeight:"500px", background: "#f5f5f5"} }>
                                        <Component {...props} /> 
                                    </main>
                                    <Footer /> 
                                </>   
                            ) 
                        :
                            <Redirect to={
                                {
                                    pathname: "/login",
                                    state: {
                                        from: props.location
                                    }
                                }
                            } />
                    }
                }
                
            />
        </ErrorBoundary>
    );

}

