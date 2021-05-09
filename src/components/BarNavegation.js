import { Navbar, Nav, Container } from 'react-bootstrap'
import { React, Component } from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';

class BarNavegation extends Component {
    
     constructor(props){
       super(props);
                     
       this.url_logout = `${process.env.REACT_APP_API_BACKEND}/auth/token/logout/`;
       
     }
               
     logout = () => {
        
        const token = localStorage.getItem('auth_token');
        
        axios.post(this.url_logout, token, {headers: {'Authorization': `Token ${token}`}}).then(res => {
          
          localStorage.removeItem('current_user');
          localStorage.removeItem('auth_token');
          
          this.props.setCurrentUser('');

        });
        
    }

    logged_out_nav = (current_user) => (
        <>
        <Link to="/" className="nav-link">Welcome {current_user}</Link>
        <Link to="/" onClick={this.logout} className="nav-link">Logout</Link>
        </>
    );
    
    logged_in = (
      <>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/singup" className="nav-link">Sing up</Link>
      </>
    );
    
    render () {

      return <>    
    <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>    
        <Container>
            <LinkContainer to="/">
              <Navbar.Brand>MovieApp Rating</Navbar.Brand>
            </LinkContainer>            
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id='responsive-navbar-nav'>
                <Nav>
                  {this.props.current_user ? this.logged_out_nav(this.props.current_user) : this.logged_in }                  
                </Nav>                             
            </Navbar.Collapse>                     
        </Container>
    </Navbar>
    </>;
    }
    

}

export default BarNavegation;
