// pages/user/user.js
import instance from '../../utils/request';

import { whoami } from '../../utils/userApi';
import { navigateTo } from '../../utils/util';

// 配置setting模块点击后跳转的页面
let settingPage = [
    {
        name: 'changeInfo',
        to: '/pages/changeInfo/changeInfo'
    },
    {
        name: 'feedBack',
        to: '/pages/feedBack/feedBack'
    }
];
// 配置功能模块点击后跳转的页面
let models = [
    {
        name: 'teacher',
        to: '/pages/dialogue/dialogue'
    }
];

import { createStoreBindings } from '../../miniprogram_npm/mobx-miniprogram-bindings/index';

//导入store对象
import { store } from '../../store/store';
import utils from '../../utils/util';

Page({
    data: {
        settings: [
            {
                type: 'changeInfo',
                title: '修改资料'
            },
            {
                type: 'explain',
                title: '使用指南'
            },
            {
                type: 'about',
                title: '关于问知'
            },
            {
                type: 'feedBack',
                title: '我要反馈'
            }
        ],
        models: [
            {
                type: 'teacher',
                title: '我要提问',
                content: '开启学习之旅'
            },
            {
                type: 'dialogue',
                title: '我要提问',
                content: '开启学习之旅'
            }
        ],
        firstShow: true
    },
    async onLoad() {
        //自动登录
        //获取sotre的data和方法
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ['token', 'userInfo', 'remainAnswer', 'totalAnswers'],
            actions: ['setToken', 'setUserInfo', 'setRemainAnswer', 'setTotalAnswers']
        });

        // 向服务器发送请求获取数据用来渲染
        let resp;
        try {
            resp = await whoami();
        } catch (error) {
            resp = await error;
        }

        if (!resp.data) {
            this.setToken('');
            return;
        } else if (resp.code === 0) {
            //获取数据成功
            let userInfo = {
                ...resp.data
            };

            // 更新store仓库的数据
            this.setUserInfo(userInfo);
            this.setRemainAnswer(userInfo.aiFreeAnswers);
            this.setTotalAnswers(userInfo.aiFreeAnswers);
        } else {
            wx.showToast({
                title: resp.msg,
                icon: 'error'
            });
        }
    },
    toType(event) {
        // settings点击事件用来跳转相对应的页面
        console.log(event.currentTarget.dataset.type);
        //没有登录，跳转登录界面

        if (!this.data.token) {
            navigateTo('/pages/userInfo/userInfo');
            return;
        }
        let type = event.currentTarget.dataset.type;
        //获取模块对应的页面
        let index = utils.getIndex(settingPage, type);

        if (index !== -1) {
            navigateTo(settingPage[index].to);
        }
    },
    toModel(event) {
        // models点击事件用来跳转相对应的页面
        console.log(event.currentTarget.dataset.type);

        //没有登录，跳转登录界面
        if (!this.data.token) {
            navigateTo('/pages/userInfo/userInfo');
            return;
        }
        let type = event.currentTarget.dataset.type;
        if (type === 'teacher') {
            //判断是否是第一次登录，第一次登录则要选择年级
            if (!this.data.userInfo.grade) {
                navigateTo('/pages/grade/grade');
                return;
            }
        }
        //获取模块对应的页面
        let index = utils.getIndex(models, type);

        if (index !== -1) {
            navigateTo(models[index].to);
        }
    },
    //前往登录界面
    async getUserInfo() {
        navigateTo('/pages/userInfo/userInfo');
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
    }
});
