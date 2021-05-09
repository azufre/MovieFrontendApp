import React from 'react';
import {Form, Button} from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

class SignupForm extends React.Component {

  empty_form = {
    email:'',
      username: '',
      password: '',
      first_name:'',
      last_name:'',
      phone:''
  };

  state = {
    isRegisterSuccess:false,
    form:{
      email:'',
      username: '',
      password: '',
      first_name:'',
      last_name:'',
      phone:''
    },
    disabled:false,
    errors:{
      ...this.empty_form
    }

  };

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState.form[name] = value;
      return newState;
    });
  };

  handle_login = (e) => {

    const url_register = `${process.env.REACT_APP_API_BACKEND}/auth/users/`;
    const data = this.state.form;
    this.setState({disabled:true});

    this.setState({
      errors:{...this.empty_form},
      isRegisterSuccess:false
    });

    axios.post(url_register, data).then(response => {

      this.setState({
        errors:{...this.empty_form},
        isRegisterSuccess:true
      });

      this.setState({disabled:false});

    }).catch(error => {

      if(error.response.status && error.response.status === 400){

          const errors = error.response.data;
          const keys = Object.keys(errors);

          keys.forEach(key => {
              errors[key].forEach(error =>{
                this.setState(prevstate => ({
                  errors: {...prevstate.errors, [key]:error}
                }));
              });
          });
                  
      }

      this.setState({disabled:false});

    });

    e.preventDefault();

  }

  successSignup = (
    <div style={{'width':'400px', 'height':'300px', 'backgroundColor':'white', 'padding':'15px', 'margin':'auto'}}>
      <h1>Sing up</h1>      
      <span style={{'display':'block'}}>Sign up success. Please go to <Link to="/login">Login.</Link></span>      
    </div>
  );

  render() {
    return (<>
      {this.state.isRegisterSuccess ?  this.successSignup :
      <div style={{'width':'400px', 'backgroundColor':'white', 'padding':'15px', 'margin':'auto'}}>
        <h1>Sing up</h1>        
        <Form onSubmit={this.handle_login}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="email" value={this.state.form.email}
           onChange={this.handle_change} required/>
           <span style={{'color':'red'}}>{this.state.errors.email}</span>
        </Form.Group>
        <br/>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>User Name</Form.Label>
          <Form.Control type="text" placeholder="Enter user name" name="username" value={this.state.form.username}
           onChange={this.handle_change} required/>
           <span style={{'color':'red'}}>{this.state.errors.username}</span>
        </Form.Group>
        <br/>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="password" value={this.state.form.password}
           onChange={this.handle_change} required/>
           <span style={{'color':'red'}}>{this.state.errors.password}</span>
        </Form.Group>
        <br/>
        <Form.Group controlId="formBasicFistName">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" placeholder="Enter first name" name="first_name" value={this.state.form.first_name}
           onChange={this.handle_change} required/>
           <span style={{'color':'red'}}>{this.state.errors.first_name}</span>
        </Form.Group>
        <br/>
        <Form.Group controlId="formBasicLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" placeholder="Enter last name" name="last_name" value={this.state.form.last_name}
           onChange={this.handle_change} required/>
           <span style={{'color':'red'}}>{this.state.errors.last_name}</span>
        </Form.Group>
        <br/>
        <Form.Group controlId="formBasicPhone">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="text" placeholder="Enter phone" name="phone" value={this.state.form.phone}
           onChange={this.handle_change} required/>
           <span style={{'color':'red'}}>{this.state.errors.phone}</span>
        </Form.Group>
        <hr/>
        <Button variant="primary" type="submit" disabled={this.state.disabled}>
          Login
        </Button>
      </Form>
      </div>}</>
    );
  }
}

export default SignupForm;
