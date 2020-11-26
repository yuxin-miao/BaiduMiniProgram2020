import {createMoodRecord} from  '../../utils/api.js';
import {MoodNumber} from '../../utils/constants.js';

const app = getApp();

Page({
    data: {
        username: '',
        avatar: '',
        moodtype: [ "smile", "like",  "happy", "upset", "sad", "angry", "ok"
        ],
        selectedMood: "",
        moodDescription: ''
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
        this.setData({
            username: app.getLocalStorage('username'),
            avatar: app.getLocalStorage('avatar')
         });
         console.log(app.isAuthenticated());
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
        // console.log(MoodNumber[type]);
        if (this.data.selectedMood == "") {
            swan.showToast({
                title: '请选择心情！',
                icon: 'none',
                duration: 1500,
            })
            return;
        }
        if (this.data.moodDescription == "") {
            swan.showToast({
                title: '请填写描述！',
                icon: 'none',
                duration: 1500,
            })
            return;
        }

        console.log(this.data.selectedMood);
        let moodType = MoodNumber[this.data.selectedMood];
        console.log(moodType);
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        createMoodRecord({
            year: prevPage.data.thisYear,
            month: prevPage.data.thisMonth,
            day: prevPage.data.selectDay,
            type: moodType,
            description: this.data.moodDescription
        });
        swan.showToast({
            title: '记录成功',
            icon: 'none',
            duration: 1500
        })
        console.log("createmood");
        // let tempMonthDays = thisMonthDays;
        // tempMonthDays[selectDay-1].mood = this.data.selectedMood;

        // prevPage.setData({
        //     // thisMonthDays: tempMonthDays,
        //     "thisMonthDays[selectDay-1].mood": this.data.selectedMood,
        //     thisDescription: this.data.moodDescription,
        // })
        console.log(prevPage.data.thisMonthDays[prevPage.data.selectDay-1].mood);
        console.log(prevPage.data.thisDescription);
        console.log("finish create mood");
        // prevPage.updateMood(this.data.selectedMood, this.data.moodDescription);


        // console.log(res);
        // prevPage.setData({
        //     selectDay: res.data.
        // })
        // res.data.description

        // swan.redirectTo({
        //     url: '/pages/myCalender/myCalender'
        // });
        // }
    },
    MoodDescription: function(e) {
        this.setData({
            moodDescription: e.detail.value
        })
    }
});