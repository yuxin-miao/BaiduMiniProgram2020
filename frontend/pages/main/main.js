Page({
    data: {

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
    goMoodRecord(e) {
        if (getApp().isAuthenticated()) {
            // swan.navigateTo ({
            //     url: '/pages/mysetting/mysetting'
            // })
            swan.navigateTo ({
                url: '/pages/myCalender/myCalender'
            })
        } else {
            swan.authorize({
                scope: 'scope.userInfo',
                success: res => {
                    getApp().login(this.toMood);
                },
                fail: err => {
                    swan.showToast({
                        title: '授权失败',
                        icon: 'none'
                    })
                }
            })
        }
    },
    startChat(e) {
        if (getApp().isAuthenticated()) {
            swan.navigateTo ({
                url: '/pages/Uchat/Uchat'
            })
        } else {
            swan.authorize({
                scope: 'scope.userInfo',
                success: res => {
                    getApp().login(this.toChat);
                },
                fail: err => {
                    swan.showToast({
                        title: '授权失败',
                        icon: 'none'
                    })
                }
            })
        }
    },
    goIntro(e) {
        swan.navigateTo ({
            url: '/pages/intro/intro'
        })
    },
    toChat: function() {
        swan.navigateTo ({
            url: '/pages/Uchat/Uchat'
        })
    },
    toMood: function() {
        swan.navigateTo ({
            url: '/pages/myCalender/myCalender'
        })
    }
});