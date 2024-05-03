// pages/grade/grade.js
import { createStoreBindings } from '../../miniprogram_npm/mobx-miniprogram-bindings/index';
import instance from '../../utils/request';

//导入store对象
import { store } from '../../store/store';
import { updateUserInfo } from '../../utils/userApi';

Page({
    data: {
        grades: [
            '一年级',
            '二年级',
            '三年级',
            '四年级',
            '五年级',
            '六年级',
            '初一',
            '初二',
            '初三',
            '高一',
            '高二',
            '高三'
        ],
        selectedGrade: ''
    },
    onLoad(options) {
        //获取store数据
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ['token', 'userInfo', 'remainAnswer'],
            actions: ['setToken', 'setUserInfo', 'setRemainAnswer']
        });
    },
    //更改选中的样式
    selectGrade(event) {
        const grade = event._relatedInfo.anchorRelatedText.trim();
        this.setData({
            selectedGrade: grade
        });
    },
    //前往对话
    async toQuest() {
        if (this.data.selectedGrade) {
            let options = {
                ...this.data.userInfo,
                grade: this.data.selectedGrade
            };
            wx.showLoading();
            //修改年级
            let resp;
            try {
                resp = await updateUserInfo(options);
            } catch (error) {
                resp = await error;
            }
            if (resp.code === 0) {
                //年级修改成功
                this.setUserInfo(options);
                wx.hideLoading();
                wx.navigateTo({
                    url: '/pages/dialogue/dialogue?detail=2'
                });
            } else {
                wx.showToast({
                    title: resp.msg,
                    icon: 'error'
                });
            }
        } else {
            wx.showToast({
                title: '请选择年级',
                icon: 'none'
            });
        }
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
    }
});
