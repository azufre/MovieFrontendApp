import React, { Component } from 'react';
import BarNavegation from './components/BarNavegation';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {Container} from 'react-bootstrap';

import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ContainerMovie from './components/ContainerMovie';
import Movie from './components/Movie';

import { GuardRouteNoAuthRequired } from './guard/GuardeRoute';

class App extends Component {

  state = {
    'current_user': ''
  }

  setCurrentUser = (current_user) => {
    this.setState({'current_user': current_user});
  }

  componentDidMount(){
    this.setState({'current_user': localStorage.getItem('current_user')});
  }

  render() {
    
    const currentUser = this.state.current_user;
    
    return <>
              <BrowserRouter>
                <BarNavegation current_user={currentUser} setCurrentUser={this.setCurrentUser}/>
                <Container>
                <Switch>                    
                    <GuardRouteNoAuthRequired path='/login' component={LoginForm} propsComponent={{'setCurrentUser':this.setCurrentUser}}/>
                    <Route path='/singup'>
                      <SignupForm />
                    </Route>
                    <Route path='/movie/:pk'>
                      <Movie current_user={currentUser} />
                    </Route>
                    <Route path='/'>
                      <ContainerMovie />
                    </Route>                    
                  </Switch>    
                </Container>                    
              </BrowserRouter>                                        
          </>    
  }
}

export default App;