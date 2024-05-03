// components/avatar.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        avatarUrl: {
            type: String,
            value:
                'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        baseUrl: app.globalData.baseUrl
    },

    /**
     * 组件的方法列表
     */
    methods: {
        chooseAvatar: function (event) {
            const that = this;
            wx.uploadFile({
                url: 'http://localhost:3002/api/upload/avatar',
                filePath: event.detail.avatarUrl,
                name: 'file',
                header: {
                    name: 'file'
                },
                success(res) {
                    console.log(res);
                    let data = JSON.parse(res.data);
                    if (data.code === 0) {
                        //头像上传成功
                        let url = that.data.baseUrl + data.data;
                        that.setData({
                            avatarUrl: url
                        });
                        that.triggerEvent('chooseAvatar', url);
                    } else {
                        wx.showToast({
                            title: data.msg
                        });
                    }
                }
            });
        }
    }
});
