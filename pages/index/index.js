// pages/index/index.js
let timer;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        firstShow: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const that = this;
        timer = setTimeout(() => {
            wx.navigateTo({
                url: '/pages/user/user'
            });
            that.data.firstShow = true;
        }, 3200);
    },
    onShow() {
        if (!this.data.firstShow) return;
        wx.navigateTo({
            url: '/pages/user/user'
        });
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        clearTimeout(timer);
    }
});
