
import 'weapp-cookie';
import cookies from 'weapp-cookie';
Page({
    data: {
        // feedId: 0,
        whetherShow: true,
        transBubble: '',
        userThisInput: '',
        feedUrl: 'https://xiaou.tech/api/feedback/',
        modelInfo: '',
        allFeed: [{user: '暂无反馈内容', reply: '暂无回复内容'}],
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
                console.log(res)
                if (res.data !== []) {
                    this.setData({
                        // feedId: res.data.id,
                        feedUrl: 'https://xiaou.tech/api/feedback/' +  res.data.id,
                    })
                }

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
        console.log(this.data.userThisInput)
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
                this.setData({
                    userThisInput: ''
                })
                console.log(res)
            }
        })
    },
    getFeedback: function()  {
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
                this.setData({
                    userThisInput: ''
                })
                console.log(res)
            }
        })
    },
});