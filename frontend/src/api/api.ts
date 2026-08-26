import axios from "axios"

const api = axios.create({
    baseURL:'http://ec2-15-164-230-209.ap-northeast-2.compute.amazonaws.com:8080',
    timeout:5000,
    headers:{
      'Content-Type':'application/json',
    }
});

export default api;