import React from 'react'; 
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../../App.css";

const Footer=()=>{
    return (
        <footer className='footer'>
            <Container>
            <span style={{color:'white'}}>Copyright © 2024 by </span><Link style={{ color:'white'}} as={Link} to={"https://anandmohan75.github.io/My-Portfolio/"}>Mr. Anand Mohan Chaudhary</Link>
            </Container>
        </footer>
    )
}

export default Footer;