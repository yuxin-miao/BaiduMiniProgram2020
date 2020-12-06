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
        swan.setPageInfo({

            title: 'Ucho心理陪伴',
            keywords: 'Ucho,ucho,大学生,心理,情感,咨询,Ucho心理陪伴',
            description: 'Ucho',
            articleTitle: 'Ucho',
            releaseDate: '2020-12-01 12:01:30',
            image: [
                'https://c.hiphotos.baidu.com/forum/w%3D480/sign=73c62dda83b1cb133e693d1bed5456da/f33725109313b07e8dee163d02d7912396dd8cfe.jpg',
                'https://hiphotos.baidu.com/fex/%70%69%63/item/43a7d933c895d143e7b745607ef082025baf07ab.jpg'
            ],
            video: [{
                url: 'https://www.baidu.com/mx/v12.mp4',
                duration: '100',
                image: 'https://ms-static.cdn.bcebos.com/miniappdocs/img/image-scaleToFill.png'
            }],
            visit: {
                pv: '1000',
                uv: '100',
                sessionDuration: '130'
            },
            likes: '75',
            comments: '13',
            collects: '23',
            shares: '8',
            followers: '35',
            success: res => {
                console.log('setPageInfo success', res);
            },
            fail: err => {
                console.log('setPageInfo fail', err);
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
    },
    goAni(e) {
        console.log("ff")
        swan.redirectTo({
            url: '/index/index'
        })
    }
});