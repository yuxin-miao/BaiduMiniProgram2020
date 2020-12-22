
import 'weapp-cookie';
import cookies from 'weapp-cookie';
Page({
    data: {
        // feedId: 0,
        whetherShow: true,
        transBubble: '',
        userThisInput: '',
        modelInfo: '',
        allFeed: [],
        showOneFeed: 0,
        oneFeed: {},
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数

    },
    triggerTransition(e) {
        this.setData({
            transBubble: 'bubble'
        })
    },

    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
        swan.getSystemInfo({
            success: res => {
                this.setData({
                    modelInfo: res.model,
                })
            }
        })
        swan.request({
            url: 'https://xiaou.tech/api/feedback/',
            method: 'GET',
            success: res => {
                if (res.data !== []) {
                    res.data.forEach(element => {
                        this.requestEachID(element.id)
                    })
                }
                else {
                    this.setData({
                        tempAllFeed: [{content: '暂无反馈内容', replies: []}],
                    })
                }

            }  
        })
    },
    requestEachID: function(id) {
        swan.request({
            url: 'https://xiaou.tech/api/feedback/' + id + '/',
            method: 'GET',
            success: res => {
                let tempAllFeed = this.data.allFeed;
                tempAllFeed.push({
                    content: res.data.content,
                    replies: res.data.replies,
                })
                this.setData({
                    allFeed: tempAllFeed,
                })
            }

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
    userInput(e) {
        this.setData({
            userThisInput: e.detail.value,
        })
    },
    submitFeedback(e) {
        if (this.data.userThisInput === "") {
            swan.showToast({
                title: '未填写反馈内容',
                icon: 'none',
            
            })
            return;
        }
        let that = this;
        // console.log(this.data.userThisInput)
        swan.request({
            url: 'https://xiaou.tech/api/feedback/',
            method: 'POST',                
            header: {
                // POST 携带
                'X-CSRFToken': cookies.get('csrftoken')
            },
            data: {
                system_info: this.data.modelInfo,
                content: this.data.userThisInput
            },
            success: res => {
                if (res.statusCode != 201) {
                    swan.showToast({
                        title: '提交失败，请稍后再试',
                        icon: 'none',
                    })
                }
                let tempAllFeed = that.data.allFeed;
                tempAllFeed.push({
                    content: res.data.content,
                    replies: res.data.replies,
                })
                this.setData({
                    userThisInput: '',
                    allFeed: tempAllFeed,

                })
                // console.log(res)
            },
            fail: res => {
                swan.showModal({
                    title: '提交失败',
                    content: '请检查您的网络连接'
                })
            }
        })
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