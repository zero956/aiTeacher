import instance from './request';
import { getCamera } from './authority';
let authorization = wx.getStorageSync('Authorization');

//拍照上传功能
async function photo() {
    getCamera();
    wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        camera: 'back',
        success(res) {
            console.log(res);
            console.log(res.tempFiles[0].tempFilePath);
            wx.getImageInfo({
                src: res.tempFiles[0].tempFilePath,
                success(res) {
                    console.log(res);
                }
            });
        }
    });
}
//获取ai回复
async function getHistory(info, weChatID, startSend) {
    const authoization = wx.getStorageSync('Authorization');
    const refresh = wx.getStorageSync('refresh');
    const resp = await instance.post(
        '/openai/history',
        {
            info: info,
            weChatID: weChatID,
            startSend: startSend
        },
        {
            header: {
                Authorization: 'Bearer ' + authoization,
                refresh: 'Bearer ' + refresh
            }
        }
    );

    return resp;
}
//获取历史记录
async function aiContent(context, weChatID) {
    const authoization = wx.getStorageSync('Authorization');
    const refresh = wx.getStorageSync('refresh');
    const resp = await instance.post(
        '/openai',
        {
            context: context,
            weChatID: weChatID
        },
        {
            header: {
                Authorization: 'Bearer ' + authoization,
                refresh: 'Bearer ' + refresh
            }
        }
    );

    return resp;
}

module.exports = {
    photo,
    aiContent,
    getHistory
};
