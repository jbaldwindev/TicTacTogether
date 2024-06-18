import React, { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { useLocation } from 'react-router-dom';

const CustomNav = (props) => {
    const [homeActive, setHomeActive] = useState(true);
    const location = useLocation();

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
              <Navbar.Brand href="Home">Tic-Tac-Together</Navbar.Brand>
              <Nav activeKey={location.pathname} className="me-auto">
                
                <Nav.Link href="/Home">Home</Nav.Link>
                <Nav.Link href="/Info">Info</Nav.Link>
              </Nav>
            </Container>
        </Navbar>
    );
}
export default CustomNav;