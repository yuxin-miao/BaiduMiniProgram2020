Page({
    data: {
        items: [
            {
                name: '心情日记',
                open: false
            },
            {
            name: '关于我们',
            open: false
            }
        ],



    },
    imageError(e) {
      console.log('image 发生 error 事件，携带值为', e.detail.errMsg);
    },
    onTap(e) {
      console.log('image 发生 tap 事件', e);
    },
    imageLoad(e) {
        console.log('image 加载成功', e.type);
    },
    navigateTo(e) {
        swan.navigateTo({
            url: '/pages/chat/chat'
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
    }
});