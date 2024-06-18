import axios from 'axios';

const USER_API_BASE_URL = "https://secret-lake-51530-ff11d6e23491.herokuapp.com/api/v1/";

class HelloWorldService {

    getMessage(){
        return axios.get(USER_API_BASE_URL+"hello");
    }
}

export default new HelloWorldService()