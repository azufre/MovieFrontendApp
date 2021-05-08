import axios from 'axios';
import React from 'react';
import {Form, Button} from 'react-bootstrap';
import { withRouter } from "react-router-dom";

class LoginForm extends React.Component {

  state = {
    email: '',
    password: '',
    IsLoginSuccess: true,
    disabled:false,
  };

  url_login = 'http://localhost:8000/auth/token/login/';
  url_me = 'http://localhost:8000/auth/users/me/';

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  handle_login = (e) => {

    this.setState({disabled:true});

    axios.post(this.url_login, this.state).then(res => {
      
      localStorage.setItem('auth_token', res.data.auth_token);  
      
      axios.get(this.url_me, {headers: {'Authorization': `Token ${res.data.auth_token}`}}).then(res => {
          
        localStorage.setItem('current_user', res.data.username);
        this.props.setCurrentUser(res.data.username);
        this.props.history.push("/");
        
      })
      
    }).catch(error => {
        if(error.response.status && error.response.status === 400){
          this.setState({'IsLoginSuccess': false, 'password':'', disabled:false});          
        }
    });

    e.preventDefault();
  
  }

  render() {

    const loginFail = (
      <div style={{'fontSize':'18', 'color':'red', 'margin':'15px'}}>
          <span style={{'display':'block'}}>* Email or Password is not correct.</span>
      </div>
    );

    return (
      <div style={{'height':'400px', 'width':'400px', 'backgroundColor':'white', 'padding':'15px', 'margin':'auto'}}>
        <h1>Login</h1>
        <Form onSubmit={this.handle_login}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="email" value={this.state.email}
           onChange={this.handle_change} required/>
        </Form.Group>
        <br/>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="password" value={this.state.password}
           onChange={this.handle_change} required/>
        </Form.Group>
        <hr/>
        <Button variant="primary" type="submit" disabled={this.state.disabled}>
          Login
        </Button>
      </Form>
      {
        !this.state.IsLoginSuccess ? loginFail : ""
      }      
      </div>
    );
  }
}

export default withRouter(LoginForm);
