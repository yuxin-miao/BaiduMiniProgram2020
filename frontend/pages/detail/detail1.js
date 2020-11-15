Page({
    data: {
        // 更多icon请参看右侧示例的icon全集
        list: ['collect'],
        iconSize: '150pt'
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
    successHandler(e) {
        console.log('success', e.detail.errMsg);
    },
    failHandler(e) {
        console.log('fail', e.detail.errMsg);
    },
    completeHandler(e) {
        console.log('complete', e.detail.errMsg);
    },
    onShow() {
        console.log(getCurrentPages()); // [{uri: 'index/index'}]
        // 可以根据页面栈来判断页面层级
    },
    navigateTo(e) {
        swan.navigateTo({
            url: '/pages/chat/chat'
        });
    }
});


