import 'weapp-cookie';
import cookies from 'weapp-cookie';
var util = require('../../utils/util.js');

Page({
    data: {
        time: '',
        scrollTop: 0,
        windowHeight: 0,
        prevMsgs: [], // previous messages
        thisSenderMsg: '', // 即时输入
        thisDisplayMsg: '', // 发送/显示的用户信息
        displayMsgs: [], // item {type: msg: } 本次聊天所有信息 for both
        justEnter: '0', // 进入时的判断
        taskFinish: false,
        talkMatching: '0',
        whetherDetermineMatch: '1',
        // getInitialMsg:[], // get_question 开始新话题 匹配关键词或者不匹配
        // getInitialCh: [], 
        // getInitialChRe: [],
        // getInitialDoCh: "0",
        nickname: "", // 通过是否有名字判断是否初次进入
        doChoice: "0", // 选择选项：1 / 纯输入：0,
        uChoices: [], // choices given, array of strings
        uChRely: [], // reply by U after select a choice 
        
        // lastId: thisDisplayMsg[thisDisplayMsg - 1]
    },
    onLoad: function () {
        console.log('load')
        // console.log(messages);
        // 监听页面加载的生命周期函数
        var time = util.chatTime(new Date());
        this.setData({
            time: time
        });
        this.initial();
        this.getNickName(); // 获取用户信息并且进行是否第一次使用判断

    },
    onReady: function() {
        console.log('ready')
        // 监听页面初次渲染完成的生命周期函数
        var height = swan.getSystemInfoSync().windowHeight;
        this.setData({
          windowHeight: height,
          scrollTop: 8000000000
        });
        this.scrollToBottomTemp();

    },
    onShow: function() {
        // 监听页面显示的生命周期函数
        console.log('show')

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
    recordNav(e) {
        swan.navigateTo({
            url: '/pages/myCalender/myCalender'
        });
    },

     // SENDER input 
    SenderMsg:function(e){
        this.setData({
        thisSenderMsg:e.detail.value
        });
    },
    // RAW input: SEND data and GET NEW  
    sendMsg:function(){
        if(this.data.thisSenderMsg == ''){
            swan.showToast({
                title: '消息不能为空',
                icon: 'none',
                duration: 1000
            })
            return ;
        }
        let tempMsgs = this.data.displayMsgs;
        tempMsgs.push ({
            type:'', 
            msg: this.data.thisSenderMsg
        }); // for user msg
        this.setData({
            displayMsgs: tempMsgs,
        })
        if (this.data.justEnter == "1") {
            if(this.data.thisSenderMsg.length > 5){
                swan.showToast({
                    title: '昵称长度不可大于五个字符',
                    icon: 'none',
                    duration: 1400
                })
                return;
            }
            swan.request({
                url: getApp().getUrl('/account/nickname/'),
                method: 'POST',
                header: {
                    // POST 携带
                    'X-CSRFToken': cookies.get('csrftoken')
                },
                data: {nickname: this.data.thisSenderMsg},
                success: res => {
                    if (res.statusCode != 200) {
                        swan.showModal({
                            title: '请求失败',
                            content: '昵称设置失败',
                            duration: 1400
                        })
                    }
                    this.getInitialUpdateData(-1);

                }
            })
        }
        else if (this.data.taskFinish === "0") {
            if (this.data.whetherDetermineMatch === '0') {
                swan.request({
                    url: getApp().getUrl('/message/reply/'),
                    method: 'POST',
                    header: {
                        // POST 携带
                        'X-CSRFToken': cookies.get('csrftoken')
                    },
                    data: {content: this.data.thisSenderMsg},
                    success: res => {
                        if (res.data.title != "") {
                            this.allQuestionUpdate(res);
                            return;
                        } 
                    },
                    fail: err => {
                        swan.showModal({
                            title: '网络异常',
                            content: '请检查网络连接'
                        });
                    }
                })
            }
            let tempDis = this.data.displayMsgs;
            tempDis.push({
                type: '1',
                msg: '有想和我聊聊的话题吗？'
            });
            let tempCh = ["有", "没有"];
            let tempChRe = ["有", "没有"];
            this.setData({
                displayMsgs: tempDis,
                doChoice: '1',
                uChoices: tempCh,
                uChRely: tempChRe,
                taskFinish: '1',
            })
            
        }
        else if (this.data.taskFinish === "1") {
            swan.showModal({
                title: "错误",
                content: "sendMsg taskFinish"
            })
        }

    },
    // CHOICE: send choice 
    selectChoice(e) {
        // update user's reply and u's reply 
        let choiceIndex = e.currentTarget.dataset.choiceIndex;
        let tempMsgs = this.data.displayMsgs;
        tempMsgs.push ({
            type:'0', 
            msg: this.data.uChRely[choiceIndex],
        }); 
        this.setData({
            displayMsgs: tempMsgs,
        })
        if (this.data.justEnter === "0" &&  this.data.taskFinish === '0') {
            swan.request({
                url: getApp().getUrl('/message/reply/'),
                method: 'POST',
                header: {
                    // POST 携带
                    'X-CSRFToken': cookies.get('csrftoken')
                },
                data: {content: choiceIndex},
                success: res => {
                    console.log('selectChoice: ', res);
                    if (res.data.title != "") {
                        this.allQuestionUpdate(res);
                        return
                    }
                    let tempDis = this.data.displayMsgs;
                    tempDis.push({
                        type: '1',
                        msg: '有想和我聊聊的话题吗？'
                    });
                    let tempCh = ["有", "没有"];
                    let tempChRe = ["有", "没有"];
                    this.setData({
                        displayMsgs: tempDis,
                        doChoice: '1',
                        uChoices: tempCh,
                        uChRely: tempChRe,
                        taskFinish: '1',
                    })
                },
                fail: err => {
                    swan.showModal({
                        title: '网络异常',
                        content: '请检查网络连接'
                    });
                }
            })
        }
        else {

            if (this.data.whetherDetermineMatch === '0') {
                this.getInitialUpdateData(choiceIndex);
                return
            }

            if (choiceIndex === '0') this.matchingQuestion();
            else this.notMatchingQuestion();

        }
    },
    initial: function() {
        swan.request({
            url: getApp().getUrl('/message/'),
            method: 'GET',
            success: res => {
                console.log('initial record: ', res);
                if (res.statusCode != 200) {
                    swan.showModal({
                        title: '请求失败',
                        content: 'sendMsg Fail'
                    });
                    return;
                }
                let tempPrevM = [];
                res.data.forEach(record => {
                    let tempType = record.sender === null ? "1" : "0";
                   tempPrevM.push({
                       type: tempType,
                       msg: record.content
                   })
                })
                this.setData({
                    prevMsgs: tempPrevM,
                })
                setTimeout(() => {
                    this.scrollToBottomTemp()
                }, 2000);

            },
            fail: err => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            }
        })

    },
    scrollToTop(e) {
        this.setData({ scrollTop: 0 });

    },
    scrollToBottomTemp() {
        // console.log(e);
        console.log("scrollToBottomTemp");
        this.setData({ scrollTop: 8000000000 });
    },

    pageScrollToBottom: function() {
        var that = this;
        var height = swan.getSystemInfoSync().windowHeight;
        console.log('pageScrollToBottom', height);
        swan.createSelectorQuery().select('#page').boundingClientRect(function(rect) {
          if (rect){
            that.setData({
              windowHeight: height,
              scrollTop: rect.height
            })
          };
          console.log('pageScrollToBottom', that.data.scrollTop);
        }).exec()
    },
    getInitialUpdateData: function(chIndex) { // 还未向服务器请求question
        let tempDis = this.data.displayMsgs;

        if (this.data.doChoice == '1' &&  this.data.taskFinish == false && chIndex == 1) {
            // 非初次进入+上次话题未结束+想继续聊
            // get last question 
            this.getLastQuestion();
            this.setData({
                justEnter: '0',
            })
            return;
        }
        
        if (this.data.taskFinish === true) {    // 非初次进入+话题已经结束
            this.setData({
                justEnter: '0',
            });
            if (chIndex == '0') {
                //matching 
                this.matchingQuestion();
            }
            else {
                // not matching 
                this.notMatchingQuestion();
            }
            return;
        };

          // 初次进入 或 再次进入不想继续上次的话题
        tempDis.push({
            type: '1',
            msg: '有想和我聊聊的话题吗'
        })
        this.setData({
            displayMsgs: tempDis,
            uChoices: ["有", "没有"],
            uChRely: ["有", "没有"],
            doChoice: '1',
            whetherDetermineMatch: '1'
        },() => {this.scrollToBottomTemp()})

        
    },
    getNickName: function() {
        swan.request({
            url: getApp().getUrl('/account/user/'),
            method: 'GET',
            success: res => {
                if (res.statusCode != 200) {
                    swan.showModal({
                        title: '请求失败',
                        content: 'getNickName Fail'
                    })
                }
                this.setData({
                    nickname: res.data.nickname
                }, () => {
                    this.userEnter();
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
    userEnter: function() {
        this.setData({
            justEnter: "1",
        })
        if(this.data.nickname == "") { // first enter 
            let tempDis = [
                { type: "1", msg: "你好，我是小U" },
                { type: "1", msg: "怎么称呼你呢？"}
            ];
            
            this.setData({
                displayMsgs: tempDis,
                doChoice: '0',
            })
        }
        else {
            let tempMsg = this.data.nickname + "，欢迎回来！";
            let tempDis = [
                { type: "1", msg: tempMsg },
            ];
            swan.request({
                url: getApp().getUrl('/message/talk_finished'),
                method: 'GET',
                header: {
                    // POST 携带
                    'X-CSRFToken': cookies.get('csrftoken')
                },
                success: res => {
                    console.log('tempTaskFinish', res);
                    if (res.statusCode != 200) {
                        swan.showModal({
                            title: "请求错误",
                            content: 'tempTaskFinish fail'
                        })
                        return;
                    }
                    if (res.data.talk_finished === false) {
                        let tempDis = this.data.displayMsgs;
                        tempDis.push({
                            type: '1',
                            msg: '你想要和我接着聊上次的话题吗？'
                        });
                        let tempCh = ["接着聊", "重新开始"];
                        let tempChRe = ["让我们接着聊吧", "我想要聊别的"];
                        this.setData({
                            displayMsgs: tempDis,
                            doChoice: '1',
                            uChoices: tempCh,
                            uChRely: tempChRe,
                            taskFinish: res.data.talk_finished,
                        })
                    }
                    else {
                        let tempDis = this.data.displayMsgs;
                        tempDis.push({
                            type: '1',
                            msg: '有想和我聊聊的话题吗？'
                        });
                        let tempCh = ["有", "没有"];
                        let tempChRe = ["有", "没有"];
                        this.setData({
                            displayMsgs: tempDis,
                            doChoice: '1',
                            uChoices: tempCh,
                            uChRely: tempChRe,
                            taskFinish: res.data.talk_finished,
                        })
                    }   
                }
            })
        }
    },
    talkFinish: function() {
        swan.request({
            url: getApp().getUrl('message/talk_finished'),
            method: 'GET',
            success: res => {
                if (res.statusCode != 200 ) {
                    swan.showModal({
                        title: "请求失败",
                        content: "talkFinish fail"
                    })
                    return;
                }
                this.setData({
                    taskFinish: this.data.talk_finished,
                })
            }
        })
    },    
    notMatchingQuestion: function(){
        swan.request({
            url: getApp().getUrl('/message/get_question/'),
            method: 'GET',
            success: res => {
                this.allQuestionUpdate(res);
            },
            fail: err => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            }
        })
    },
    
    matchingQuestion: function() {
        swan.request({
            url: getApp().getUrl('/message/get_question/'),
            method: 'GET',
            data: {matching: this.data.thisSenderMsg},
            success: res => {
                this.allQuestionUpdate(res);
            },
            fail: err => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            }


        })
    },
    getLastQuestion: function(){
        swan.request({
            url: getApp().getUrl('/message/get_last_question/'),
            method: 'GET',
            success: res => {
                this.allQuestionUpdate(res);
            },
            fail: err => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            }
        })
    },
    allQuestionUpdate: function(res) {
        if (res.statusCode != 200) {
            swan.showModal({
                title: '请求失败',
                content: 'sendMsg Fail'
            });
            return;
        }
        let tempDis = this.data.displayMsgs;
        tempDis.push({
            type: "1",
            msg: res.data.title
        });
        let tempCh = [];
        let tempChRe = [];

        if (res.data.reply_type == 1) {
            res.data.choices.forEach(element => {
                tempCh.push(element.title),
                tempChRe.push(element.reply_content)
            })
        }
        this.setData({ 
            displayMsgs: tempDis,
            uChoices: tempCh,
            uChRely: tempChRe,
            doChoice: res.data.reply_type
        },() => {this.scrollToBottomTemp()})
    },
    
    
});