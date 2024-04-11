// pages/userInfo/userInfo.js

const defaultAvatarUrl =
    'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
import instance from '../../utils/request';
import { createStoreBindings } from '../../miniprogram_npm/mobx-miniprogram-bindings/index';
//导入store对象
import { store } from '../../store/store';

Page({
    data: {
        baseUrl: 'http://localhost:3001/'
    },
    onLoad(options) {
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ['token', 'userInfo'],
            actions: ['setToken', 'setUserInfo']
        });
    },
    //选择头像
    chooseAvatar(event) {
        const that = this;
        wx.uploadFile({
            url: 'http://localhost:3001/api/upload/avatar',
            filePath: event.detail.avatarUrl,
            name: 'file',
            header: {
                name: 'file'
            },
            success(res) {
                let data = JSON.parse(res.data);
                let url = 'http://localhost:3001/' + data.data;
                //请求成功更新头像
                that.setData({
                    'userInfo.avatarUrl': url
                });
            }
        });
    },
    async submit(e) {
        //修改信息
        let name = e.detail.value.nickName;
        if (!name) {
            wx.showToast({
                title: '昵称不能为空',
                icon: 'none'
            });
            return;
        }
        const that = this;
        this.setData({
            'userInfo.userName': name
        });
        wx.showLoading();
        let option = {
            ...this.data.userInfo,
            phoneNumber: e.detail.value.phoneNumber,
            school: e.detail.value.school
        };
        let authorization = wx.getStorageSync('Authorization');
        //发送put请求修改用户信息
        let result = await instance.put('/users', option, {
            header: {
                Authorization: 'Bearer ' + authorization
            }
        });
        if (result.data.code === 0) {
            //修改成功，更新store的用户信息
            wx.hideLoading();
            that.setUserInfo(this.data.userInfo);
        } else {
            //修改失败，返回主界面
            wx.showToast({
                title: result.data.msg
            });
        }
        wx.navigateBack();
    },
    backHome() {
        wx.navigateBack();
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
    }
});
