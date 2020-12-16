// import Poster from '../../miniprogram_dist/poster/poster';


Page({
    data: {

    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        var that = this;
        this.updateManager = swan.getUpdateManager();
        this.updateManager.onUpdateReady(res => {
            swan.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启小程序？',
                confirmText: '重启',
                success:res => {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        this.updateManager.applyUpdate();
                    }
                }
            });
        });
        this.firstOrNot();


        // this.updateManager.onUpdateFailed(err => {
        //     // 新的版本下载失败
        //     console.log('版本下载失败原因', err);
        //     swan.showToast({
        //         title: '新版本下载失败，请稍后再试',
        //         icon: 'none'
        //     });
        // });
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