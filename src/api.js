import axios from "axios"

export default axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Token': import.meta.env.VITE_APP_UUID,
        'Content-Type': 'application/json; charset=UTF-8;'
    }
});