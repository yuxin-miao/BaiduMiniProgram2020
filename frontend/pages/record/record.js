import {createMoodRecord} from  '../../utils/api.js';
import {MoodNumber, MoodColor} from '../../utils/constants.js';

const app = getApp();

Page({
    data: {
        colors: MoodColor,
        nickname: '',
        moodtype: [ "smile", "like",  "happy", "upset", "sad", "angry", "ok"],
        selectedMood: "",
        moodDescription: ''
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        this.getNickName();
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
        //  console.log(app.isAuthenticated());
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
    selectMood(e) {
        // console.log('Clicked', e.currentTarget.dataset.mood);
        this.setData({selectedMood: e.currentTarget.dataset.mood});
    },
    createMood() {
        // let type = this.data.selectedMood;
        let thisDis = this.data.moodDescription == "" ? this.data.selectedMood : this.data.moodDescription;
        if (this.data.selectedMood == "") {
            swan.showToast({
                title: '请选择心情！',
                icon: 'none',
                duration: 1500,
            })
            return;
        }

        let moodType = MoodNumber[this.data.selectedMood];
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        createMoodRecord({
            year: prevPage.data.thisYear,
            month: prevPage.data.thisMonth,
            day: prevPage.data.selectDay,
            type: moodType,
            description: thisDis,
        });
        // console.log("selectDay:", prevPage.data.selectDay);
        swan.showToast({
            title: '记录成功',
            icon: 'none',
            duration: 1500
        });

    },
    MoodDescription: function(e) {
        this.setData({
            moodDescription: e.detail.value
        })
    },
    getNickName: function() {
        swan.request({
            url: getApp().getUrl('/account/user/'),
            method: 'GET',
            success: res => {
                // console.log(res);
                if (res.statusCode != 200) {
                    // getApp().clearAndReenter();

                    swan.showModal({
                        title: '加载中...',
                        content: ''
                    })
                };
                let tempNick = ' ' + res.data.nickname;

                if (res.data.nickname === null || res.data.nickname.length === 0) {
                    tempNick = ' ' + "百度网友";
                } 
                this.setData({
                    nickname: tempNick,
                })
            },
            fail: err => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            }
        })
    }, 
    returnNav(e) {
        swan.navigateBack();
    }
});