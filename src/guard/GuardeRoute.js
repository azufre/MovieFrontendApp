import React from 'react';
import {Route, Redirect} from 'react-router-dom';

const token = localStorage.getItem('auth_token');

const GuardRouteNoAuthRequired = ({component: Component, propsComponent, ...rest}) => (
    <Route {...rest} render={()=>(
        token ? <Redirect to='/' /> : <Component {...propsComponent} />
    )} />
)

export {
    GuardRouteNoAuthRequired,    
}