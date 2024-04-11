import http from '../utils/request';

const loginUser = userInfo => {
    return http.post('/users/login', userInfo);
};
