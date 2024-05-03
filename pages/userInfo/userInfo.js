// pages/userInfo/userInfo.js

import instance from '../../utils/request';
import { createStoreBindings } from '../../miniprogram_npm/mobx-miniprogram-bindings/index';
//导入store对象
import { store } from '../../store/store';
import { addUserInfo } from '../../utils/userApi';
import { navigateBack } from '../../utils/util';

Page({
    onLoad(options) {
        //导入store数据
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ['token', 'userInfo', 'remainAnswer', 'totalAnswers'],
            actions: ['setToken', 'setUserInfo', 'setRemainAnswer', 'setTotalAnswers']
        });
    },
    //选择头像
    chooseAvatar(event) {
        const avatarUrl = event.detail;
        let newUserInfo = {
            ...this.data.userInfo,
            avatarUrl
        };
        this.setUserInfo(newUserInfo);
    },
    async submit(e) {
        // 注册
        let name = e.detail.value.nickName;
        if (!name) {
            wx.showToast({
                title: '昵称不能为空',
                icon: 'none'
            });
            return;
        }
        const that = this;
        wx.showLoading({
            title: '登录中，请稍后'
        });
        wx.login({
            async success(res) {
                let resp;
                wx.hideLoading();
                try {
                    resp = await addUserInfo({
                        ...that.data.userInfo,
                        userName: name,
                        code: res.code
                    });
                } catch (error) {
                    resp = await error;
                }
                if (resp.code === 0) {
                    // 注册成功
                    let userInfo = {
                        ...resp.data
                    };
                    const token = wx.getStorageSync('Authorization');
                    //更新store数据
                    that.setToken(token);
                    that.setUserInfo(userInfo);
                    that.setRemainAnswer(userInfo.aiFreeAnswers);
                    that.setTotalAnswers(userInfo.aiFreeAnswers);
                } else {
                    wx.showToast({
                        title: resp.msg,
                        icon: 'error'
                    });
                }
                wx.navigateBack();
            }
        });
    },
    //返回主界面
    backHome() {
        navigateBack();
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
    }
});
