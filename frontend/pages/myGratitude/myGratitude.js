Page({
    data: {
        toView: 0,
        allMonths: [],
        gUrls: ['https://cdn.xiaou.tech/grati0.png', 'https://cdn.xiaou.tech/grati1.png'],
        gMages: [],
        imgLoaded: 1,
        getSelectMonth: {year: '2020', month: '12'},
        today: 0, 
        days: [],
        weekGratitude: [], // item [{day: , description: }]  [{day: , description: }] in array for each week
        eachDayGratiture: [], //[  [ {day: ,description: []}, {day: }, ], []  ]
        eDays: [{day: 0, description: []}],
        openCard: 1,
        openIdx: 0,
        
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        // this.downLoadGMage();
        let timestamp = Date.parse(new Date());
        let date = new Date(timestamp);
        //获取年份  
        let Y =date.getFullYear();
        //获取月份  
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //获取当日日期 
        let D = date.getDate();
        let tempD = [21, 15, 14, 8, 7, 1];
        let tempM = [{month: 'DEC'}, {month: 'DEC'}, {month: 'DEC'}];
        let tempDG = [];
        let tempEachDays =[];

        if (D > 21) {
            tempD = [28, 22, 21, 15, 14, 8, 7, 1];
            tempM = [{month: 'DEC'}, {month: 'DEC'}, {month: 'DEC'}, {month: 'DEC'}];
        }
        tempM.forEach(ele => {
            tempDG.push([]);
            tempEachDays.push([{}]);
        })
        this.setData({
            getSelectMonth: {year: Y, month: M},
            today: D,
            days: tempD,
            allMonths: tempM,
            weekGratitude: tempDG,
            eachDayGratiture: tempEachDays
        }, ()=>{
            console.log('1!',tempEachDays)
            this.moodTypeGratitude({year: Y, month: M});
        })
        


    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数

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
    returnNav(e) {
        swan.navigateBack();
    },
    downLoadGMage: function() {

        var that = this;
        let tempSrc = this.data.gMages;

        this.data.gUrls.forEach(eachUrl => {

            swan.downloadFile({
                url: eachUrl,
                success: function (res) {

                    if (res.statusCode === 200) {
                        let eachSrc = res.tempFilePath; //下载成功返回结果
                        tempSrc.push(eachSrc);
                        that.setData({
                            gMages: tempSrc
                        })
                    }
                    else {
                        swan.showToast({
                        title: '加载失败！',
                        icon: 'none',
                        duration: 2000});
                    }
                }
            });
        });
    },

    // imageError(e) {
    //     console.log('image 发生 error 事件，携带值为', e.detail.errMsg);
    //   },
    //   onTap(e) {
    //     console.log('image 发生 tap 事件', e);
    //   },
    //   imageLoad(e) {
    //       console.log('image 加载成功', e.type);
    //   },
        /* util functions for getting data */
    moodTypeGratitude: function (selectMonth) {
            // send data: selectMonth(year & month)
            // return the moodType & gratitudeRecord
            // used when first enter / change month
        swan.request({
            url: getApp().getUrl('/mood/month/'),
            method: 'GET',
            data: selectMonth,
            success: res => {
                let returnMood = []; //used to return
                if (res.statusCode != 200) {
                    this.clearAndReenter(this.moodTypeGratitude(selectMonth));

                    swan.showModal({
                        title: '请求失败',
                        content: '请点击右上角选择重启'
                    });
                    return;
                }
                console.log(res)
                let tempDG = this.data.weekGratitude;
                let lastDay = this.data.today;
                let lastIdx = 0;
                let tempEDays = [[], [], []];
                let tD = this.data.eDays;
                // console.log('here', tempEDays);

                res.data.gratitudeList.forEach(graRecord => {
                    let tempDate = (new Date(graRecord.created_at)).getDate();
                    for (let i = 0; i < this.data.days.length - 1; i++) {
                        if (tempDate <= this.data.days[i] && tempDate >= this.data.days[i+1]) {
                            tempDG[Math.floor(i /2)].push ({
                                day: tempDate,
                                description: '      '+ graRecord.description,
                            })

                            break;
                        }
                    }
                    if (tempDate < this.data.days[lastIdx*2+1]) {
                        lastIdx = lastIdx + 1;
                    }
                    // console.log('start', tempEDays);
                    let lED = tD.pop();
                    if (lED != undefined && lED.day !=0 ) {
                        if (lED.day == tempDate) {
                            // console.log("1", laDays);
                            lED.description.push(graRecord.description);
                            tD.push(lED);
                        }
                        else {
                            // console.log("2", laDays);

                            tD.push(lED);
                            let newDays = {day: tempDate, description: [graRecord.description]};
                            tD.push(newDays);
                        }
                    }
                    else {
                        // console.log("3", laDays);

                        lED = {day: tempDate, description: [graRecord.description]};
                        tD.push(lED);
                    }
                    // let laDays = tempEDays[lastIdx].pop();

                    // if (laDays != undefined && laDays != []) {
                    //     if (laDays.day == tempDate) {
                    //         console.log("1", laDays);
                    //         laDays.description.push(graRecord.description);
                    //         tempEDays[lastIdx].push(laDays);
                    //     }
                    //     else {
                    //         console.log("2", laDays);

                    //         tempEDays.push(laDays);
                    //         let newDays = {day: tempDate, description: [graRecord.description]};
                    //         tempEDays[lastIdx].push(newDays);
                    //     }
                    // }
                    // else {
                    //     console.log("3", laDays);

                    //     laDays = {day: tempDate, description: [graRecord.description]};
                    //     tempEDays[lastIdx].push(laDays);
                    // }
                    // console.log('end', tempEDays);
                });
                // for (let i = 0; i < tempDG.length; i++ ){
                //     if (tempDG[i].length == 0)
                // }
                this.setData({
                    weekGratitude: tempDG,
                    eachDayGratiture: tempEDays,
                    eDays:  tD,
                }, ()=> {
                    console.log(this.data.eDays)
                    // this.setUrl(this.data.thisDay)
                });
    

            },
            fail: err => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            }
        });
    },
    openThisOne(e) {
        this.setData({
            openIdx: e.currentTarget.dataset.cardIdx,
            openCard: 1,
        });
    },
    closeThisOne(e) {
        this.setData({
            openCard: 0,
        })
    },
});