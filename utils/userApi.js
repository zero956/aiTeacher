import instance from './request';
// let authorization = wx.getStorageSync('Authorization');

//修改用户询信息
function updateUserInfo(userInfo) {
    const authoization = wx.getStorageSync('Authorization');
    const refresh = wx.getStorageSync('refresh');
    return instance.put('/users', userInfo, {
        header: {
            Authorization: 'Bearer ' + authoization,
            refresh: 'Bearer ' + refresh
        }
    });
}

//添加用户信息
function addUserInfo(userInfo = {}) {
    return instance.post('/users/login', userInfo);
}

//根据token，自动获取用户信息
function whoami() {
    const authoization = wx.getStorageSync('Authorization');
    const refresh = wx.getStorageSync('refresh');
    console.log(refresh);
    return instance.get(
        '/users/whoami',
        {},
        {
            header: {
                Authorization: 'Bearer ' + authoization,
                refresh: 'Bearer ' + refresh
            }
        }
    );
}

module.exports = {
    updateUserInfo,
    addUserInfo,
    whoami
};
