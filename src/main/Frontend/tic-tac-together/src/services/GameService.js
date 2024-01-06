import axios from "axios";

const USER_API_BASE_URL = "http://localhost:8080/api/v1/";

class GameService {
    postMove(playerNumber) {
        return axios.post(USER_API_BASE_URL + 'move', {
            playerNum: playerNumber,
            spaceNum: 1
        });
    }
}

export default new GameService;