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

//延时函数
const delay = function (time) {
    return Promise(resovle => {
        setTimeout(resolve, time);
    });
};

module.exports = {
    getIndex,
    delay
};
