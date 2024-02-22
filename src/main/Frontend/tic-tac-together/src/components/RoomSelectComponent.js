import {useNavigate} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './styles/Home.css';
import '../services/RoomService';
import RoomService from '../services/RoomService';
//TODO
//make it so that when a room is created, it posts to the server so that
//other people loading the site will be able to see and join the room
//the server should create an ID number for this room, and send this back to the client
//the client should then add a button to the page with this id and have it call joinRoomClick onClick
//upon loading page, get the list of rooms from the server and 
const RoomSelectComponent = (props) => {
    const navigate = useNavigate();
    //this could just be a list of numbers which represent the room IDs
    const [roomButtonList, setRoomButtonList] = useState([]);
    const joinRoomClick = (e) => {
        //e.target.id for getting the button ID
        navigate('/room/' + parseInt(e.target.id));
    }

    //TODO remove this
    const joinRoomClickFake = (e) => {
        //e.target.id for getting the button ID
        navigate('/room');
    }

    //TODO instead of incrementing the number by 1 and adding a button
    //send a request to the server, then when it sends back the id
    //add a button with that ID
    const addRoom = () => {
        RoomService.PostAddRoom().then((response) => {
            const newRoomID = parseInt(response.data);
            setRoomButtonList([...roomButtonList, newRoomID]);
        });
        // const lastID = roomButtonList[roomButtonList.length - 1];
        // const newButtonID = lastID + 1;
        // setRoomButtonList([...roomButtonList, newButtonID]);
    }

    //TODO remove this
    useEffect(() => {
        setRoomButtonList([...roomButtonList, 1, 2]);
    }, []);

    return (
        <div>
            <button onClick={addRoom}>Add New Room</button>
            <button onClick={(e) => joinRoomClickFake(e)}>Join Room 1</button>
            { roomButtonList.length > 0 ? roomButtonList.map((buttonID) => (
                <button id={buttonID} onClick={(e) => joinRoomClick(e)}>Join Room {buttonID}</button>
            )) : <p>No Rooms yet</p>}
        </div>
    );
}
export default RoomSelectComponent;