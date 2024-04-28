import {useNavigate} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './styles/Home.css';
import '../services/RoomService';
import RoomService from '../services/RoomService';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
//TODO
//make refresh button that allows user to get updated list of rooms without
//refreshing the page
const RoomSelectComponent = (props) => {
    const navigate = useNavigate();
    const [roomButtonList, setRoomButtonList] = useState([]);
    const [retrievedRoomList, setRetrievedRoomList] = useState([]);
    const joinRoomClick = (e) => {
        navigate('/room/' + parseInt(e.target.id));
    }

    const addRoom = () => {
        RoomService.PostAddRoom().then((response) => {
            const newRoomID = parseInt(response.data);
            setRoomButtonList([...roomButtonList, newRoomID]);
        });
    }

    useEffect(() => {
        RoomService.GetRooms().then((response) => {
            let idList = []
            for (const roomData of response.data) { 
                idList = [...idList, parseInt(roomData.RoomID)];
            }
            console.log(idList);
            setRoomButtonList(roomButtonList.concat(idList));
        });
    }, []);

    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark">
              <Container>
                <Navbar.Brand href="#home">Tic-Tac-Together</Navbar.Brand>
                <Nav className="me-auto">
                  <Nav.Link href="#home">Home</Nav.Link>
                  <Nav.Link href="#features">Features</Nav.Link>
                  <Nav.Link href="#pricing">Pricing</Nav.Link>
                </Nav>
              </Container>
            </Navbar>
            
            <ButtonGroup vertical>
                <Button variant="success" onClick={addRoom}>Add New Room</Button>
                { roomButtonList.length > 0 ? roomButtonList.map((buttonID) => (
                    <Button id={buttonID} onClick={(e) => joinRoomClick(e)}>Join Room {buttonID}</Button>
                )) : <p>No Rooms yet</p>}
            </ButtonGroup>
        </div>
    );
}
export default RoomSelectComponent;