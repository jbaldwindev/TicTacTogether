import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const CustomNav = (props) => {
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
              <Navbar.Brand href="Home">Tic-Tac-Together</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link href="Home">Home</Nav.Link>
                <Nav.Link href="Info">Info</Nav.Link>
              </Nav>
            </Container>
        </Navbar>
    );
}
export default CustomNav;