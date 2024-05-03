// pages/userInfo/userInfo.js
import instance from '../../utils/request';
import { createStoreBindings } from '../../miniprogram_npm/mobx-miniprogram-bindings/index';
//导入store对象
import { store } from '../../store/store';
import { updateUserInfo } from '../../utils/userApi';
import { navigateBack } from '../../utils/util';

Page({
    data: {
        baseUrl: 'http://localhost:3001/'
    },
    //引入store库
    onLoad(options) {
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ['token', 'userInfo'],
            actions: ['setToken', 'setUserInfo']
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
    //提交信息
    async submit(e) {
        //修改信息
        let name = e.detail.value.userName.trim();
        if (!name) {
            wx.showToast({
                title: '昵称不能为空',
                icon: 'none'
            });
            return;
        }
        const that = this;
        wx.showLoading();
        let option = {
            ...this.data.userInfo,
            ...e.detail.value
        };

        //发送put请求修改用户信息
        let resp;
        try {
            resp = await updateUserInfo(option);
        } catch (error) {
            resp = await error;
        }
        if (resp.code === 0) {
            //修改成功，更新store的用户信息
            wx.hideLoading();
            const newUserInfo = {
                ...that.data.userInfo,
                userName: name
            };
            that.setUserInfo(newUserInfo);
        } else {
            //修改失败，返回主界面
            wx.showToast({
                title: resp.msg,
                icon: 'error'
            });
        }
        wx.navigateBack();
    },
    //返会主菜单
    backHome() {
        navigateBack();
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
    }
});
