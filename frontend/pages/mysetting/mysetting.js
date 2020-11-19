Page({
    data: {

    },
    bindKeyfocus(e){
    },
    bindKeyblur(e) {
        swan.showToast({
            title: '普通input失焦事件',
            icon: 'none'
        });
    },
    bindKeycomfirm(e) {
        swan.showToast({
            title: '点击确定',
            icon: 'none'
        });
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
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

    login(e) {
        let userInfo = e.detail;
        getApp().login(userInfo);
    },
    logout() {
        getApp().logout();
    },
    getUser() {
        swan.request({
            url: getApp().getUrl('/account/user/'),
            success: res => {
                console.log(res);
            },
            fail: err => {
                console.log(err);
            }
        })
    }
});