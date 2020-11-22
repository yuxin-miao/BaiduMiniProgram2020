const app = getApp();

Page({
    data: {
        username: '',
        avatar: '',
        moodtype: [ "smile", "like",  "happy", "upset", "sad", "angry", "ok"
        ],
        selectedMood: ''
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
        this.setData({
            username: app.getLocalStorage('username'),
            avatar: app.getLocalStorage('avatar')
         });
         console.log(app.isAuthenticated());
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
    selectMood(e) {
        console.log('Clicked', e.currentTarget.dataset.mood);
        this.setData({selectedMood: e.currentTarget.dataset.mood});
    }
});