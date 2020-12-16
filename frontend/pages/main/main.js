Page({
    data: {
        isWeb: 0,
        showPrivacy: 0,
        loginChat: 0,
        loginRecord: 0,
        showIntro: 0,
        transBubble: '',
        // privacyContent: 
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        swan.getSystemInfo({
            
            success: res => {
                if (res.platform == 'web') {
                    this.setData({
                        isWeb: 1
                    })
                }
                else {
                    this.setData({
                        isWeb: 0,
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
            var that = this;
            this.imageIntro(that);
            return;
        }
        if (getApp().isAuthenticated()) {
            // swan.navigateTo ({
            //     url: '/pages/mysetting/mysetting'
            // })
            swan.navigateTo ({
                url: '/pages/myCalender/myCalender'
            })
        } else {
            this.setData({
                showPrivacy: 1,
                loginRecord: 1,
            })

        }
    },
    startChat() {
        console.log("transition finish")
        if (this.data.isWeb == 1) {
            var that = this;
            this.imageIntro(that);
            return
        }
        if (getApp().isAuthenticated()) {
            swan.navigateTo ({
                url: '/pages/Uchat/Uchat'
            })
        } else {
            this.setData({
                showPrivacy: 1,
                loginChat: 1,
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
    },
    showModal(e) {
        this.setData({
            showPrivacy: 1,
        })
    },
    hideModal(e) {
        this.setData({
            showPrivacy: 0,
        })
        if (this.data.loginChat == 1) {
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
        else if (this.data.loginRecord == 1) {
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
    imageIntro(that) {

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

                    swan.showLoading();

                    swan.downloadFile({
                        url: 'https://cdn.xiaou.tech/introtop.svg',
                        success: res => {
                            if (res.statusCode === 200) {
                                that.setData({
                                    backTopUrl: res.tempFilePath,
                                })
                                console.log("finish", res.tempFilePath)

                            }    
                            else {
                                swan.showToast({
                                    title: '页面加载失败',
                                    icon: 'none',
                                    duration: 2000,
                                });
                            }
                        },
                        fail: err => {
                            swan.showModal ({
                                title: '页面加载失败',
                                content: '请检查网络连接'
                            });
                        },
                        complete: cmp => {
                            swan.hideLoading();
                            that.setData({
                                showIntro: 1,
                            }) 
                        }
                    });
                }
                else if (res.cancel) {
                }
            },
            fail: function (res) {}
        })
        return;
    },
    hideIntro(e) {
        this.setData({
            showIntro: 0,
        })

    },

    /* From Modernizr */
    whichTransitionEvent(){
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
        }
    
        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    },
    transitionEnd: function () {
    console.log('渐变已结束')
  },
  triggerTransition(e) {
    this.setData({
        transBubble: 'bubble'
    })
  }
    
});