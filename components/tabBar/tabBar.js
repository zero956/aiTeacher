// components/tabBar/tabBar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isBack: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        back: function () {
            this.triggerEvent('back');
        }
    }
});
