Page({
    data: {
        isWeb: 0,
        showPrivacy: 0,
        loginChat: 0,
        loginRecord: 0,
        showIntro: 0,
        transBubble: '',
        showAd: 0,
        isFirstMain: 0,
        whichToTop: -1,
        shakeThis: -1,
        ltShow: 0,
        lbShow: 0,
        rShow: 0,
        playChat: 'true',
        allText: ['欢迎使用Ucho心理陪伴', '新上线用户反馈功能！'],
        speakerText: '欢迎使用Ucho心理陪伴',
        countNum: 0,
        isLogin: 0,
        showMaskText: 'welMask',
        whetherShowNext: '',
        showSelf: 0,
        showEnve: 0,
        openEnveShow: 0,
        showMc: 'stop',
        // firstEnter: 1,
        // privacyContent: 
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        if (getApp().isAuthenticated()) {
            this.setData({
                isLogin: 1,
            })
        }
        if (swan.getStorageSync('first_mc') === 'no') {

        }
        else {
            
            this.setData({
                showEnve: 1,
            })
        }
        getApp().setLocalStorage('first_mc', 'no');

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
        });
        if (swan.getStorageSync('first_main') === 'no') {
            this.setData({
                playChat: 'false',

            }, () => {
                setTimeout(() => {
                    this.setData({
                        ltShow: 1,
                        lbShow: 1,
                        rShow: 1,
                    })
                }, 1000)

            })

        }
        else {
            this.setData({
                isFirstMain: 1,
                whichToTop: 0
            })

        }
        getApp().setLocalStorage('first_main', 'no');
        setInterval(() => {
            if (this.data.changeText === 0) {
                let currNum = this.data.countNum < this.data.allText.length - 1 ? this.data.countNum + 1 : 0;
                this.setData({
                    speakerText: this.data.allText[currNum],
                    countNum: currNum,
                    changeText: 1,
                })
            }
            else {
                this.setData({
                    changeText: 0
                })
            }

        
        }, 3000)
    },
    resetShake(e) {
        this.setData({
            shakeThis: -1,
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
        swan.navigateTo ({
            url: '/pages/myCalender/myCalender'
        })
    },
    startChat(e) {
        console.log("transition finish")
        if (this.data.isWeb == 1) {
            var that = this;
            this.imageIntro(that);
            return
        }
        if (this.data.isLogin == 1) {
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
    showPri(e) {
        console.log(this.data.whichToTop)
        this.setData({
            showPrivacy: 1,
        })
    },
    toLogin(e) {
        if (this.data.isLogin === 0) {
            this.setData({
                showPrivacy: 1,
                mainLogin: 1,
            })
        }

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
        else if (this.data.mainLogin == 1) {
            swan.authorize({
                scope: 'scope.userInfo',
                success: res => {
                    getApp().login();
                    this.setData({
                        isLogin: 1,
                        mainLogin: 0,
                    })
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
        // console.log('渐变已结束')
    },
    triggerTransition(e) {
        this.setData({
            transBubble: 'bubble'
        })
    },
    beginShake(e) {
        this.setData({
            shakeThis: e.currentTarget.dataset.whichShake,
        })
    },
    goGratitude(e) {
        swan.navigateTo({
        url: '/pages/myGratitude/myGratitude'
        })
    },
    showAdEvent(e) {
        this.setData ({
            showAd: 1,
        })
    },
    hideAdEvent(e) {
        this.setData ({
            showAd: 0,
        })
    },
    toFeed(e) {
        swan.navigateTo({
            url: '/packageInfo/pages/feedback/feedback'
        })
    },
    showLt(e) {
        this.showAllThree();

        this.setData({
            ltShow: 1,
            showMaskText: 'moodMask',
            showSelf: 0

        }, () => {
            this.showNextPuzzle()
        })
    },
    showLb(e) {
        this.showAllThree();

        this.setData({
            lbShow: 1,
            showMaskText: 'graMask',
            showSelf: 0
        }, () => {
            this.showNextPuzzle()
        })
    },
    showR(e) {
        this.showAllThree();
        this.setData({
            rShow: 1,
            showMaskText: 'selfMask',  
            showSelf: 1

        }, () => {
            this.showNextPuzzle()
        })
    },
    showAllThree: function() {
        if (this.data.ltShow === 1 && this.data.lbShow === 1 && this.data.rShow === 1) {
            this.setData({
                isFirstMain: 0,
                whichToTop: -1,
                playChat: 'false',
            })
        }
    },
    showNextPuzzle: function() {
        let temp = "继续探索下一张拼图..."
        if (this.data.ltShow === 1 && this.data.lbShow === 1 && this.data.rShow === 1) {
            temp = "立即点击，开始体验..."
        }
        this.setData({
            whetherShowNext: temp,
        })
    },
    openEnve(e) {
        this.setData({
            openEnveShow: 1
        })
    },
    letterEnd(e) {
        this.setData({
            showMc: 'play',
        })        
    },
    closeEnve(e) {
        if (this.data.showEnve == 1 && this.data.showMc == 'play') {
            this.setData({
                showEnve: 0
            })
        }

    }
});