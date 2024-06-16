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
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CustomNav from './CustomNav';
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
            <CustomNav></CustomNav>
            <Container className="room-selector">
              <Row className="justify-content-md-center">
                <Col md={{ span: 6, offset: 3 }}>
                  <Card style={{ width: '18rem' }}>
                    <Card.Header className="center-btn"><Button variant="primary" onClick={addRoom}>Add New Room</Button></Card.Header>
                    <ListGroup className="roomList" variant="flush">
                      { roomButtonList.length > 0 ? roomButtonList.map((buttonID) => (
                          <ListGroup.Item><p className="roomParagraph">Room {buttonID}</p><Button className="roomButton" variant="success" id={buttonID} onClick={(e) => joinRoomClick(e)}>Join Room</Button></ListGroup.Item>
                      )) : <ListGroup.Item>No Rooms yet</ListGroup.Item>}
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
            </Container>   
        </div>
    );
}
export default RoomSelectComponent;