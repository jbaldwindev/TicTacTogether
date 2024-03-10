import axios from 'axios';

const USER_API_BASE_URL = "http://localhost:8080/room/";

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