var util = require('../../utils/util.js');

Page({
    data: {
        time: '',
        messages: [
            {
                type: "1",
                msg: "你好，我是小U"
            },
            {
                type: "",
                msg: "你好，小U～"
            },            {
                type: "1",
                msg: "你好，我是小U"
            },
            {
                type: "",
                msg: "你好，小U～"
            },            {
                type: "1",
                msg: "你好，我是小U这是一段很长的话，实现自动换行，最大宽度"
            },
            {
                type: "",
                msg: "123"
            },
            {
                type: "1",
                msg: "你好，我是小U"
            },
            {
                type: "",
                msg: "你好，小U～"
            },            {
                type: "1",
                msg: "你好，我是小U"
            },
            {
                type: "",
                msg: "你好，小U～"
            },            {
                type: "1",
                msg: "你好，我是小U"
            },
            {
                type: "",
                msg: "你好，小U～"
            },            {
                type: "1",
                msg: "你好，我是小U"
            },
            {
                type: "",
                msg: "你好，小U～"
            },            {
                type: "1",
                msg: "你好，我是小U"
            },
            {
                type: "",
                msg: "你好，小U～"
            },            {
                type: "1",
                msg: "你好，我是小U"
            },
            {
                type: "",
                msg: "你好，小U～"
            },            {
                type: "1",
                msg: "你好，我是小U"
            },
            {
                type: "",
                msg: "你好，小U～"
            }
        ]

    },
    onLoad: function () {
        // console.log(messages);
        // 监听页面加载的生命周期函数
        var time = util.chatTime(new Date());
        this.setData({
            time: time
        });
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
    },
    onHide: function() {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function() {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function() {
        // 监听用户下拉动作
    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    }
});