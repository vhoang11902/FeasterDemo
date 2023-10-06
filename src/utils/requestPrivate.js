import axios from "axios";
const auth_token = document.cookie.split(';')
.find(cookie => cookie.trim().startsWith('auth_token='))
?.split('=')[1];
const requestPrivate = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {'Authorization': `Bearer ${auth_token}`}
});




export default requestPrivate;