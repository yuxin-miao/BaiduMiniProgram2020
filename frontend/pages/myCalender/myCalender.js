var moods = require('../../utils/constants.js');
import {MoodName, MoodType} from '../../utils/constants.js';

import 'weapp-cookie';
import cookies from 'weapp-cookie';

export const API = "https://xiaou.tech/api";

Page({
    data: {
        selectDay: '',
        constMonth: '',
        constDay: '',
        thisYear: '',
        thisMonth: '',
        thisDay: '',
        testString: "WOW~",
        thisMonthDays: [],
        emptyGridsBefore: [],
        emptyGridsAfter: [],
        returnMoodRecord: [],
        weekText: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

        // test 
        testMoodRecord: [{
            type: 3,
            description: "long test messagethis is a long long long long long test messagethis is a long long long long long test message"
        }],
        tesMoodRecord: {}


    },
    methods : {
        // number of days in this month
        getThisMonthDays: function(year, month) {
            return new Date(year, month, 0).getDate();
        },
        // grid for this month
        gridThisMonth: function(year, month) {
            let thisMonthDays = [],
                numberDays = this.getThisMonthDays(year, month); // call number
            for (let i = 1; i <= numberDays; i++) {
                thisMonthDays.push({
                    date: i,
                    mood: MoodName[MoodType.LIKE]
                });
            }
            return thisMonthDays;
        },
        // empty grids for this month
        emptyGrid: function(year, month) {
            let week = new Date(Date.UTC(year, month - 1, 1)).getDay(),
                emptyGridsBefore = [],
                emptyGridsAfter = [],
                emptyDays = (week == 0 ? 7 : week);
            let thisMonthDays = this.getThisMonthDays(year, month); // call this month day number
            let preMonthDays = month - 1 < 0
                ? this.getThisMonthDays(year - 1, 12) : this.getThisMonthDays(year, month - 1);

            //空出日期
            for (let i = 1; i <= emptyDays; i++) {
                emptyGridsBefore.push(preMonthDays - (emptyDays - i));
            }

            let after = (42 - thisMonthDays - emptyDays) - 7 >= 0
                        ? (42 - thisMonthDays - emptyDays) - 7
                        : (42 - thisMonthDays - emptyDays);
            for (let i = 1; i <= after; i++) {
                emptyGridsAfter.push(i);
            }
            if (emptyGridsBefore.length == 7) {
                emptyGridsBefore = [];
            }
            return { before: emptyGridsBefore, after: emptyGridsAfter};
        },
        //补全0
        zero: function (i) {
            return i >= 10 ? i : '0' + i;
        }
    },

    onLoad: function () {
        // swan.setNavigationBarTitle({
        //     title: thisMonth
        // });
        // 监听页面加载的生命周期函数

        let timestamp = Date.parse(new Date());
        let date = new Date(timestamp);
        //获取年份  
        let Y =date.getFullYear();
        //获取月份  
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //获取当日日期 
        let D = date.getDate();

        // call function to create grids
        let mday = this.methods.gridThisMonth(Y, M);
        let emptys = this.methods.emptyGrid(Y, M);
        // console.log(emptys.after);
        // set the default selectDay as today
        this.setData({
            thisMonthDays: mday,
            emptyGridsBefore: emptys.before,
            emptyGridsAfter: emptys.after,
            thisDay: D,
            constMonth: M,
            constDay: D,
            thisMonth: M,
            thisYear: Y,
            selectDay: D
        });
        let temp = this.returnMoodRecord({
            Year: this.data.thisYear,
            Month: this.data.thisMonth,
            Day: this.data.selectDay
        });
        this.setData({returnMoodRecord: temp});
        // console.log(this.data.returnMoodRecord);
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
        // this.today();

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
    //选择天数
    selectDay(e) {
        console.log('Clicked', e.currentTarget.dataset.day);
        this.setData({selectDay: e.currentTarget.dataset.day});
        console.log(this.data.thisMonth);
        console.log(this.data.selectDay);
        let temp = this.returnMoodRecord({
            Year: this.data.thisYear,
            Month: this.data.thisMonth,
            Day: this.data.selectDay
        });
        this.setData({returnMoodRecord: temp});
        console.log(this.data.tesMoodRecord);
        if (JSON.stringify(this.data.tesMoodRecord) == '{}') {
            if (this.data.selectDay > this.data.constDay) {
                swan.showToast({
                    title: '无法为未来添加心情',
                    icon: 'none',
                    // image: "../../images/gratitude_icon.png",
                    duration: 1500
                })
                return;
            }
            swan.navigateTo({
                url: '/pages/record/record'
            });
        }


    },
    returnNav(e) {
        swan.navigateBack();
    },
    changePrevMonth(e) {
        this.setData({
            thisMonth: this.data.thisMonth == 1 ? 12 : this.data.thisMonth - 1,
            thisYear: this.data.thisMonth == 1 ? this.data.thisYear - 1 : this.data.thisYear
        })
        // call function to create grids
        let mday = this.methods.gridThisMonth(this.data.thisYear, this.data.thisMonth);
        let emptys = this.methods.emptyGrid(this.data.thisYear, this.data.thisMonth);
        // console.log(emptys.after);
        // set the default selectDay as today
        this.setData({
            thisMonthDays: mday,
            emptyGridsBefore: emptys.before,
            emptyGridsAfter: emptys.after,
        });
        
    },
    changeNextMonth(e) {
        // console.log("after");
        if(this.data.thisMonth == this.data.constMonth) return;
        this.setData({
            thisMonth: this.data.thisMonth == 12 ? 1 : this.data.thisMonth + 1,
            thisYear: this.data.thisMonth == 12 ? this.data.thisYear + 1 : this.data.thisYear
        })
        // call function to create grids
        let mday = this.methods.gridThisMonth(this.data.thisYear, this.data.thisMonth);
        let emptys = this.methods.emptyGrid(this.data.thisYear, this.data.thisMonth);
        // console.log(emptys.after);
        // set the default selectDay as today
        this.setData({
            thisMonthDays: mday,
            emptyGridsBefore: emptys.before,
            emptyGridsAfter: emptys.after,
        });
    },

    returnMoodRecord: function (selectDay) {
    // used to return the mood record in 'select day'
    swan.request({
        url: `${API}/mood/`,
        method: 'GET',
        data: selectDay,
        success: res => {
            console.log(res);
            let returnMood = []; //used to return 
            if (res.statusCode != 200) {
                swan.showModal({
                    title: '请求失败',
                    content: 'MoodRecord Fail'
                });
                return;                    
            }
            swan.request({
                url: `${API}/mood/${res.data[0].id}/`,
                method: 'GET',
                success: res => {
                    console.log(res);
                    if (res.statusCode != 200) {
                        swan.showModal({
                            title: '请求失败',
                            content: 'MoodRecordID failed'
                        });
                    }
                    console.log(res.data.type);
                    console.log(res.data.description);
                    returnMood.push({
                        type: res.data.type,
                        description: res.data.description
                    });
                },
                fail: err => {
                    swan.showModal({
                        title: '网络异常',
                        content: 'moodid请检查网络连接'
                    });
                }
            });

            return returnMood;
            // this.setLocalStorage('returnMoodList', returnMood);
        },
        fail: err => {
            swan.showModal({
                title: '网络异常',
                content: '请检查网络连接'
            });
        }
    });
}

});