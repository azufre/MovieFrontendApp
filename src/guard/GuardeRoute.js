import React from 'react';
import {Route, Redirect} from 'react-router-dom';

const token = localStorage.getItem('auth_token');

const GuardRouteNoAuthRequired = ({component: Component, setCurrentUser, ...rest}) => (
    <Route {...rest} render={(props)=>(        
        token ? <Redirect to='/' /> : <Component {...props} setCurrentUser={setCurrentUser} />
    )} />
)

export {
    GuardRouteNoAuthRequired,    
}