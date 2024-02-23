import {useNavigate} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './styles/Home.css';
import '../services/RoomService';
import RoomService from '../services/RoomService';
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
            <button onClick={addRoom}>Add New Room</button>
            { roomButtonList.length > 0 ? roomButtonList.map((buttonID) => (
                <button id={buttonID} onClick={(e) => joinRoomClick(e)}>Join Room {buttonID}</button>
            )) : <p>No Rooms yet</p>}
        </div>
    );
}
export default RoomSelectComponent;