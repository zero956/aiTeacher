// pages/user/user.js
import instance from '../../utils/request';

//默认头像地址
const defaultAvatarUrl =
    'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

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
        ]
    },
    async onLoad() {
        let result;
        let refresh;
        //自动登录
        //获取sotre的data和方法
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ['token', 'userInfo', 'remainAnswer'],
            actions: ['setToken', 'setUserInfo', 'setRemainAnswer']
        });
        try {
            // 获取本地token
            result = this.data.token || wx.getStorageSync('Authorization');
            refresh = wx.getStorageSync('refresh');
        } catch (error) {}
        if (result) {
            //获取token成功
            // 向服务器发送请求获取数据用来渲染
            let resp = await instance.get(
                '/users/whoami',
                {},
                {
                    header: {
                        Authorization: 'Bearer ' + result,
                        refresh: 'Bearer ' + refresh
                    }
                }
            );

            if (!resp.data) return;

            //获取数据成功
            let { aiFreeAnswers, avatarUrl, isVip, userName } = resp.data.data;
            let userInfo = {
                aiFreeAnswers: aiFreeAnswers,
                avatarUrl: avatarUrl,
                isVip: isVip,
                userName: userName
            };
            // 更新store仓库的数据
            this.setUserInfo(userInfo);
            this.setRemainAnswer(aiFreeAnswers);
        }
    },
    toType(event) {
        // settings点击事件用来跳转相对应的页面
        console.log(event.currentTarget.dataset.type);
        //没有登录，跳转登录界面
        if (!this.data.token) {
            wx.navigateTo({
                url: '/pages/userInfo/userInfo'
            });
        }
        let type = event.currentTarget.dataset.type;
        let index = utils.getIndex(settingPage, type);

        if (index !== -1) {
            wx.navigateTo({
                url: settingPage[index].to
            });
        }
    },
    toModel(event) {
        // models点击事件用来跳转相对应的页面
        console.log(event.currentTarget.dataset.type);
        //没有登录，跳转登录界面
        if (!this.data.token) {
            wx.navigateTo({
                url: '/pages/userInfo/userInfo'
            });
        }
        let type = event.currentTarget.dataset.type;
    },
    async getUserInfo() {
        wx.navigateTo({
            url: '/pages/userInfo/userInfo'
        });
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
    }
});
