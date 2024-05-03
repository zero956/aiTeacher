import { createStoreBindings } from '../../miniprogram_npm/mobx-miniprogram-bindings/index';
import instance from '../../utils/request';
//导入store对象
import { store } from '../../store/store';
import { addHistory, navigateBack } from '../../utils/util';
import { updateUserInfo } from '../../utils/userApi';
import { photo, aiContent, getHistory } from '../../utils/ai';

Page({
    data: {
        history: [], //聊天记录
        context: [], //传给gpt的上下文
        userContent: '', //用户内容
        toView: 0,
        loading: false,
        quickModel: ['使用指南', '作文提分', '阅读理解', '英语水平测试', '对话练习'], //快捷指令,
        backSize: 1,
        isFresh: false,
        page: 1,
        limit: 20,
        isHistory: true,
        startSend: null
    },
    onLoad(options) {
        if (options.detail) {
            this.setData({
                backSize: options.detail
            });
        }
        //获取store数据
        this.storeBindings = createStoreBindings(this, {
            store,
            fields: ['token', 'userInfo', 'remainAnswer', 'context'],
            actions: ['setToken', 'setUserInfo', 'setRemainAnswer', 'setContext']
        });
    },
    //发送消息并且获取ai信息
    async send() {
        if (!this.data.userInfo.isVip && this.data.remainAnswer <= 0) {
            //用户次数用完
            wx.showToast({
                title: '剩余次数已经没有了，请获取次数再来吧。',
                icon: 'none'
            });

            return;
        }
        let userContent = this.data.userContent.replace(/\n/g, '').trim();
        if (this.data.loading || userContent === '') return;
        let history = [
            ...this.data.history,
            {
                role: 'user',
                content: userContent
            }
        ];
        let context = addHistory('user', userContent, this.data.context);
        this.setData({
            history: history,
            loading: true
        });
        this.setData({
            toView: 'lo'
        });

        //获取ai信息
        let resp;
        if (!this.data.startSend) {
            const now = new Date();
            now.setSeconds(now.getSeconds() - 10);
            this.setData({
                startSend: now
            });
        }
        try {
            resp = await aiContent(context, this.data.userInfo.weChatID);
        } catch (error) {
            resp = await error;
        }

        //请求超时
        if (resp.code === 408 || resp.code === 500) {
            history.push({
                role: 'assistant',
                content: '当前网络不好，请重新尝试'
            });

            this.setData({
                history: history,
                context: context,
                loading: false,
                toView: `item${this.data.history.length - 1}`
            });
            return;
        }
        history.push(resp.data);
        context = addHistory('assistant', resp.data.content, context);
        this.setData({
            history: history,
            context: context,
            loading: false,
            toView: `item${this.data.history.length - 1}`
        });
        this.setContext(context);
        //修改剩余次数
        if (!this.data.userInfo.isVip) {
            // 如果不是vip
            console.log(1);
            let remainAi = this.data.remainAnswer - 1;
            await updateUserInfo({
                aiFreeAnswers: remainAi
            });
            this.setRemainAnswer(remainAi);
        }
    },
    async getMore() {
        if (this.data.isHistory) {
            let resp;
            try {
                const info = {
                    page: this.data.page,
                    limit: this.data.limit
                };
                //发送获取历史记录请求
                resp = await getHistory(info, this.data.userInfo.weChatID, this.data.startSend);
            } catch (error) {
                resp = await error;
            }
            //获取失败
            if (resp.code === 408 || resp.code === 500) {
                wx.showToast({
                    title: resp.msg,
                    icon: 'error'
                });
            }
            // 获取成功
            if (resp.code === 0) {
                if (resp.data.length === 0) {
                    // 没有历史记录
                    wx.showToast({
                        title: '没有更多消息了',
                        icon: 'none'
                    });
                    this.setData({
                        isFresh: false,
                        isHistory: false
                    });
                    return;
                }
                const newArr = [...resp.data, ...this.data.history];
                this.setData({
                    history: newArr,
                    toView: `item${resp.data.length - 1}`,
                    isFresh: false,
                    page: this.data.page + 1
                });
            }
        } else {
            wx.showToast({
                title: '没有更多消息了',
                icon: 'none'
            });
            this.setData({
                isFresh: false
            });
        }
    },
    //拍照上传
    photo() {
        photo();
    },
    //返回主界面
    backHome() {
        let deltaSize = +this.data.backSize;

        navigateBack(deltaSize);
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
    }
});
