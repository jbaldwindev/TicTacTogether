import axios from 'axios';

const USER_API_BASE_URL = "https://secret-lake-51530-ff11d6e23491.herokuapp.com/room/";

class RoomService {
    PostAddRoom() {
        return axios.post(USER_API_BASE_URL + "addRoom");
    }

    GetRooms() {
        return axios.get(USER_API_BASE_URL + "getrooms");
    }

    GetRoomValidity(roomId) {
        return axios.get(USER_API_BASE_URL + "checkvalid/" + roomId);
    }
}

export default new RoomService()