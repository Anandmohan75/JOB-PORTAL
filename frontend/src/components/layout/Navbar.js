import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as NavbarBS, Nav, Container } from 'react-bootstrap';
import "../../App.css";

const Navbar = () => {
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem('token') ? true : false;
  const isEmployer = localStorage.getItem('isEmployer') === 'true';

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isEmployer');
    navigate(`/login`);
  };

  return (
    <NavbarBS bg="dark" variant="dark" expand="lg" style={{position:'sticky', top:'0rem', zIndex:'5', borderBottomLeftRadius:'2rem', borderBottomRightRadius:'2rem'}}>
    <Nav.Link as={Link} to='https://zidio.in'>
    <img src='vfv.jpg' alt="Zidio"/> 
    </Nav.Link> 
      <Container>
        <NavbarBS.Brand as={Link} to="/">Job Portal</NavbarBS.Brand>
        <NavbarBS.Toggle aria-controls="basic-navbar-nav" />
        <NavbarBS.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">Jobs</Nav.Link>
            {!isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            )}
            {isAuthenticated && isEmployer && (
              <Nav.Link as={Link} to="/create-job">Post a Job</Nav.Link>
            )}
            {isAuthenticated && (
              <Nav.Link onClick={onLogout}>Logout</Nav.Link>
            )}
          </Nav>
        </NavbarBS.Collapse>
      </Container>
    </NavbarBS>
  );
};

export default Navbar;
