
import 'weapp-cookie';
import cookies from 'weapp-cookie';
Page({
    data: {
        // feedId: 0,
        whetherShow: true,
        transBubble: '',
        allActivity: ["vote", "test", "aboutUs", "new"],

    },
    onLoad: function () {
        // 监听页面加载的生命周期函数

    },
    triggerTransition(e) {
        this.setData({
            transBubble: 'bubble'
        })
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
    returnNav(e) {
        swan.navigateBack();
    },

    openThisFeed(e) {
        let tmepFeedId = e.currentTarget.dataset.feedIndex;
        this.setData({
            showOneFeed: 1,
            oneFeed: this.data.allFeed[tmepFeedId],
        })
    },
    hideOneFeed(e) {
        this.setData({
            showOneFeed: 0,
        })
    }
});