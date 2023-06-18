import axios from "axios";

const host = process.env.REACT_APP_API_SERVER;

axios.defaults.baseURL=host

export default axios