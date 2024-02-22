import axios from 'axios';

const USER_API_BASE_URL = "http://localhost:8080/room/";

class RoomService {
    PostAddRoom() {
        return axios.post(USER_API_BASE_URL + "addRoom");
    }
}

export default new RoomService()