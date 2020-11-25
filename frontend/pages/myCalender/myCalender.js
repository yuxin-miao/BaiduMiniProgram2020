var moods = require('../../utils/constants.js');
import {MoodName, MoodType} from '../../utils/constants.js';

import 'weapp-cookie';
import cookies from 'weapp-cookie';

export const API = "https://xiaou.tech/api";

Page({
    data: {
        constMonth: '',
        constDay: '',
        thisYear: '',
        thisMonth: '',
        thisDay: '',
        selectDay: '',
        thisMonthDays: [], // attention for difference in index and date 
        emptyGridsBefore: [],
        emptyGridsAfter: [],
        weekText: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

        // GET data 
        // moodTypeList: {}, // item {day: , type: } in array 
        gratitudeRecord: [], // item {day: , description: } in array 
        thisDescription: '', // string of description for thisDay

        returnMoodRecord: [],


        // test 
        testMoodRecord: [{
            type: 3,
            description: "long test messagethis is a long long long long long test messagethis is a long long long long long test message"
        }],
        tesMoodRecord: {},
        testGratitute: ["这是一段很长的文字这是一段很这是一段很长的文字这是一段很", "这是一段很长的文字这是一段很这是一段很长的文字这是一段很", "这是一段很长的文字这是一段很", "长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字", "long test messagethis is a long long long long long test messagethis is a long long", "rrrrrrr", " 3333333", "f"],
        test1: ["1", "2"]

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
                    mood: 0,
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
        // D = D < 10 ? "0" + D : D;


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
            selectDay: D,
        });
        this.moodTypeGratitude({
            year: this.data.thisYear,
            month: this.data.thisMonth
        });
        this.dayMoodDescrip({
            year: this.data.thisYear,
            month: this.data.thisMonth,
            day: this.data.thisDay,
        });

    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
        // this.today();
        // console.log(this.data.moodTypeList);
        // console.log(this.data.gratitudeRecord);
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

    // navigation bar used 
    returnNav(e) {
        swan.navigateBack();
    },


    toSelectDay(e) {
        // used when select a new day in this month 
        // jump to the day if 
        console.log('Clicked', e.currentTarget.dataset.day);

        if (e.currentTarget.dataset.day > this.data.constDay & this.data.thisMonth == this.data.constMonth) {
            // cant jump to futrue
            swan.showToast({
                title: '无法为未来添加心情',
                icon: 'none',
                duration: 1800
            })
            return;
        }
        // let tempSelDay = e.currentTarget.dataset.day;
        // tempSelDay = tempSelDay < 10 ? "0" + tempSelDay : tempSelDay;
        this.setData({selectDay: e.currentTarget.dataset.day});
        // console.log("Hey! whether to change?");
        // console.log(this.data.selectDay);
        // console.log(this.data.thisMonthDays);
        // console.log(this.data.thisMonthDays[this.data.selectDay - 1].mood);
        
        if (this.data.thisMonthDays[this.data.selectDay - 1].mood == 0) {
            // when day no mood record, record first 
            // swan.showToast({
            //     title: '跳转心情记录',
            //     icon: 'none',
            //     duration: 500
            // })
            swan.navigateTo({
                url: '/pages/record/record'
            })
            return;
        }

        this.dayMoodDescrip({
            year: this.data.thisYear,
            month: this.data.thisMonth,
            day: this.data.selectDay,
        });


    },
    // when change month 
    changePrevMonth(e) {
        this.setData({
            selectDay: this.data.thisDay,
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
        this.moodTypeGratitude({
            year: this.data.thisYear,
            month: this.data.thisMonth
        });
        this.dayMoodDescrip({
            year: this.data.thisYear,
            month: this.data.thisMonth,
            day: this.data.thisDay,
        });
        
    },
    changeNextMonth(e) {
        // console.log("after");
        if(this.data.thisMonth == this.data.constMonth) return;
        this.setData({
            selectDay: this.data.thisDay,
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
        this.moodTypeGratitude({
            year: this.data.thisYear,
            month: this.data.thisMonth
        });
        this.dayMoodDescrip({
            year: this.data.thisYear,
            month: this.data.thisMonth,
            day: this.data.thisDay,
        });
    },

    /* util functions for getting data */
    moodTypeGratitude: function (selectMonth) {
        // send data: selectMonth(year & month)
        // return the moodType & gratitudeRecord 
        // used when first enter / change month 
        swan.request({
            url: `${API}/mood/month/`,
            method: 'GET',
            data: selectMonth,
            success: res => {
                let returnMood = []; //used to return 
                if (res.statusCode != 200) {
                    swan.showModal({
                        title: '请求失败',
                        content: 'moodTypeGratitude Fail 1'
                    });
                    return;                    
                }
                let tempMonthList = this.data.thisMonthDays;
                let tempGradList = [];
                let gratitudeRecord = res.data.gratitudeList;
                
                res.data.moodList.forEach(mood => {
                    let tempDate = (new Date(mood.created_at)).toLocaleDateString().split('/');
                    let tempD = tempDate[2];
                    tempMonthList[tempD - 1].mood = MoodName[mood.type];
                });
                res.data.gratitudeList.forEach(graRecord => {
                    let tempDate = (new Date(graRecord.created_at)).toLocaleDateString().split('/');
                    let tempM = tempDate[1];
                    let tempD = tempDate[2];
                    // tempD = tempD < 10 ? '0'+tempD : tempD;
                    tempGradList.push({
                        day: tempD,
                        description: graRecord.description,
                    })
                });
                
                this.setData({
                    thisMonthDays: tempMonthList,
                    gratitudeRecord: tempGradList,
                });
                console.log('moodTypeGratitude: ', this.data.thisMonthDays);

            },
            fail: err => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            }
        });
    },

    dayMoodDescrip: function (selectDay) {
        // send data: selectDay(year&month&day)
        // return this day's mood description
        // used when first enter / change day 
        swan.request({
            url: `${API}/mood/day/`,
            method: 'GET',
            data: selectDay,
            success: res => {
                console.log('dayMoodDescrip: ', selectDay),
                console.log('dayMoodDescrip: ', res);
                if (res.statusCode != 200) {
                    swan.showModal({
                        title: '请求失败',
                        content: 'dayMoodDescrip Fail'
                    });
                    return;                     
                }
                if(res.data.description == '') res.data.description = "快来添加你的心情吧";
                this.setData({
                    thisDescription: res.data.description
                })
                console.log('dayMoodDescrip: ', this.data.thisDescription);
                

            },
            fail: err => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            }

        })
    },
    updateMood(a, b) {
        // console.log('!!!!!');
        this.setData({
            "thisMonthDays[selectDay-1].mood": a,
            thisDescription: b
        })
    },

});