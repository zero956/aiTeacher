//封装request请求
let temporary;

class WxRequest {
    //默认请求参数
    defalut = {
        baseURL: '',
        url: '',
        data: null,
        method: 'GET',
        header: {
            'content-type': 'application/json'
        },
        timeout: 6000 //默认超时时长
    };

    //拦截器对象
    interceptore = {
        //请求拦截器
        request: config => config,
        //响应拦截器
        response: response => response
    };

    constructor(params = {}) {
        this.defalut = Object.assign({}, this.defalut, params);
    }

    request(options) {
        options.requestUrl = options.url;
        options.url = this.defalut.baseURL + options.url;
        options = {
            ...this.defalut,
            ...options
        };

        options = this.interceptore.request(options);
        //options参数和wx.request参数一致
        return new Promise((resolve, reject) => {
            wx.request({
                ...options,
                success: res => {
                    res = this.interceptore.response(res);
                    resolve(res);
                },
                fail: err => {
                    err = this.interceptore.response(err);

                    reject(err);
                },
                complete: () => {
                    //请求完成不管成功失败
                }
            });
        });
    }

    //封装get请求
    get(url, data = {}, config = {}) {
        return this.request(Object.assign({ url, data, method: 'GET' }, config));
    }

    //封装post请求
    post(url, data = {}, config = {}) {
        return this.request(Object.assign({ url, data, method: 'POST' }, config));
    }

    //封装delete请求
    delete(url, data = {}, config = {}) {
        return this.request(Object.assign({ url, data, method: 'DELETE' }, config));
    }

    //封装put请求
    put(url, data = {}, config = {}) {
        return this.request(Object.assign({ url, data, method: 'PUT' }, config));
    }
}

//测试
const instance = new WxRequest({
    baseURL: 'http://localhost:3002/api',
    timeout: 2000
});

//配置请求拦截器
instance.interceptore.request = config => {
    //保存请求配置以便于刷新token重新发送请求
    temporary = config;
    return config;
};

//配置响应拦截器
instance.interceptore.response = async response => {
    if (!response.data) {
        wx.showLoading({
            title: '服务器连接失败',
            mask: true
        });
        return;
    } else if (response.data.code === 401) {
        /**
         * token无感刷新
         * token过期时，服务器会传来新的token，拦截器会拦截过期响应，重新用新的token发送请求
         */
        //获取新的token和刷新token
        let authorization = response.header.authorization;
        let refresh = response.header.refresh;
        //放入本地缓存中
        wx.setStorageSync('Authorization', authorization);
        wx.setStorageSync('refresh', refresh);
        let options = {
            ...temporary,
            url: temporary.requestUrl,
            header: {
                Authorization: 'Bearer ' + authorization,
                refresh: 'Bearer ' + refresh
            }
        };
        //重新发送请求
        let resp = await instance.request(options);
        return resp;
    } else if (response.data.code === 500) {
    }
    return response;
};

export default instance;
