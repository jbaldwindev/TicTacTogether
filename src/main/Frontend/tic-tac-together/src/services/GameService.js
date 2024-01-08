import axios from "axios";

const USER_API_BASE_URL = "http://localhost:8080/api/v1/";

class GameService {
    postMove(playerNumber, spaceNumber) {
        return axios.post(USER_API_BASE_URL + 'move', {
            playerNumber: playerNumber,
            spaceNumber: spaceNumber
        });
    }

    postReset() {
        return axios.post(USER_API_BASE_URL + 'reset')
    }
}

export default new GameService;