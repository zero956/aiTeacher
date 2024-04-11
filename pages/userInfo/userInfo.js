// pages/userInfo/userInfo.js

const defaultAvatarUrl =
    'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
import instance from '../../utils/request';
import { createStoreBindings } from '../../miniprogram_npm/mobx-miniprogram-bindings/index';
//导入store对象
import { store } from '../../store/store';

Page({
    data: {
        baseUrl: 'http://localhost:3002/'
    },
    onLoad(options) {
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ['token', 'userInfo', 'remainAnswer'],
            actions: ['setToken', 'setUserInfo', 'setRemainAnswer']
        });
    },
    //选择头像
    chooseAvatar(event) {
        const that = this;
        wx.uploadFile({
            url: 'http://localhost:3002/api/upload/avatar',
            filePath: event.detail.avatarUrl,
            name: 'file',
            header: {
                name: 'file'
            },
            success(res) {
                let data = JSON.parse(res.data);
                let url = that.data.baseUrl + data.data;
                that.setData({
                    'userInfo.avatarUrl': url
                });
            }
        });
    },
    submit(e) {
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
            'userInfo.nickName': name
        });
        wx.showLoading();
        wx.login({
            success(res) {
                instance
                    .post('/users/login', {
                        avatarUrl: that.data.userInfo.avatarUrl || defaultAvatarUrl,
                        userName: name,
                        code: res.code
                    })
                    .then(res => {
                        wx.hideLoading();
                        wx.setStorageSync('Authorization', res.header.authorization);
                        wx.setStorageSync('refresh', res.header.refresh);
                        that.setToken(res.header.authorization);
                        let { aiFreeAnswers, avatarUrl, isVip, userName } = res.data.data;
                        let userInfo = {
                            aiFreeAnswers: aiFreeAnswers,
                            avatarUrl: avatarUrl,
                            isVip: isVip,
                            userName: userName
                        };
                        that.setUserInfo(userInfo);
                        that.setRemainAnswer(aiFreeAnswers);
                    });
                wx.navigateBack();
            }
        });
    },
    backHome() {
        wx.navigateBack();
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
    }
});
