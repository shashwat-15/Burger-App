import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-4a86b-default-rtdb.firebaseio.com/'
});

export default instance;