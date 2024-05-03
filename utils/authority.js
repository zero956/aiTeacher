//权限获取
function getAuthority(authority, fun) {
    wx.getSetting({
        success(res) {
            if (!res.authSetting[`scope.${authority}`]) {
                wx.authorize({
                    scope: `scope.${authority}`,
                    success() {
                        console.log('access');
                        fun();
                    }
                });
            }
        }
    });
}

//获取相机权限
function getCamera(fun = () => {}) {
    getAuthority('camera', fun);
}

module.exports = {
    getCamera
};
