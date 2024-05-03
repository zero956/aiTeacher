//默认最大为5段对话
const maxHistory = 10;

const formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : `0${n}`;
};

//获取符合条件的索引
const getIndex = function (data, name) {
    for (const item in data) {
        if (data[item].name === name) {
            return item;
        }
    }
    return -1;
};

//添加内容到数组
function addHistory(role, content, history) {
    let arr = [...history];
    if (arr.length >= maxHistory) {
        arr.shift();
    }
    arr.push({
        role,
        content
    });
    return arr;
}

//跳转页面
function navigateTo(url) {
    wx.showLoading({
        title: '正在加载'
    });
    wx.navigateTo({
        url: url,
        success: function () {
            wx.hideLoading();
        }
    });
}

//返回界面
function navigateBack(deltaSize = 1) {
    wx.showLoading({
        title: '正在加载'
    });
    wx.navigateBack({
        delta: deltaSize,
        success: function () {
            wx.hideLoading();
        }
    });
}

//延时函数
const delay = function (time) {
    return Promise(resovle => {
        setTimeout(resolve, time);
    });
};

module.exports = {
    getIndex,
    delay,
    addHistory,
    navigateTo,
    navigateBack
};
