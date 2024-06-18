import axios from "axios";

const USER_API_BASE_URL = "https://secret-lake-51530-ff11d6e23491.herokuapp.com/api/v1/";


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