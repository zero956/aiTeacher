/**
 * observable 创建被检测对象，对象属性会被转换成响应式
 * action 函数用来显示的定义 action 方法
 */
import { observable, action } from 'mobx-miniprogram';
const defaultAvatarUrl =
    'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

export const store = observable({
    token: wx.getStorageSync('Authorization') || '',
    userInfo: {
        avatarUrl: defaultAvatarUrl
    },
    remainAnswer: 0,
    totalAnswers: 0,
    context: [],
    //修改更新token
    setToken: action(function (token) {
        this.token = token;
    }),
    //更新用户信息
    setUserInfo: action(function (userInfo) {
        this.userInfo = userInfo;
    }),
    //更新剩余请求次数
    setRemainAnswer: action(function (remain) {
        this.remainAnswer = remain;
    }),
    setTotalAnswers: action(function (total) {
        this.totalAnswers = total;
    }),
    //修改ai上下文
    setContext: action(function (context) {
        this.context = context;
    })
});
