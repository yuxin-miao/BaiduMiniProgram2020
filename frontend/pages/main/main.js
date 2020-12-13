Page({
    data: {
        isWeb: 0,
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数

        swan.getSystemInfo({
            success: res => {
                if (res.platform == 'web') {
                    this.setData({
                        isWeb: 1
                    })

                    swan.showModal({
                        title:'Web功能受限',
                        content: '请至百度app体验完整功能，是否查看产品简介',
                        showCancel: true,
                        confirmText: '是',
                        confirmColor: '#55C595',
                        cancelText: '否',
                        cancelColor: '#c2c2c2',
                        success: function (res) {
                            if (res.confirm) {
                                swan.navigateTo({
                                    url: '/pages/intro/intro'
                                })
                            }
                            else if (res.cancel) {
                            }
                        },
                        fail: function (res) {}
                    })
            
                }
            },
            fail: err => {
    
            }
        });
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
        swan.setPageInfo({

            title: 'Ucho心理陪伴',
            keywords: 'Ucho,ucho,大学生,心理,情感,咨询,Ucho心理陪伴',
            description: 'Ucho',
            articleTitle: 'Ucho',
            releaseDate: '2020-12-01 12:01:30',
            success: res => {
            },
            fail: err => {
            }
        })

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
        if (this.data.isWeb == 1) {
            swan.showModal({
                title: '提示',
                content: '请至百度app体验该功能'
            })
            return
        }
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
        if (this.data.isWeb == 1) {
            swan.showModal({
                title: '提示',
                content: '请至百度app体验该功能'
            })
            return
        }
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
    },
    goAni(e) {
        swan.redirectTo({
            url: '/index/index'
        })
    },
    whetherWeb(e) {
        swan.getSystemInfo({
            success: res => {
                console.log('res', res.platform); // web
            },
            fail: err => {
    
            }
        });
    }
});