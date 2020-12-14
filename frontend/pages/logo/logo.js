// import Poster from '../../miniprogram_dist/poster/poster';


Page({
    data: {

    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        this.firstOrNot();

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
    },
    firstOrNot: function() {
        // swan.navigateTo({
        //     url: '/pages/record/record'
        // })
        // let data = this.getLocalStorage('username');
        if (swan.getStorageSync('first_enter') === 'no') {
            swan.redirectTo({
                url: '/pages/main/main',
            });
        }
        else {
            swan.redirectTo({
                url: '/index/index'
            });
        }
        getApp().setLocalStorage('first_enter', 'no');
    }
});