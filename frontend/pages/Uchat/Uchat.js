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
        this.getQuestion();
        // this.scrollToBottom();
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

        // this.pageScrollToBottom();
        // console.log("onReady ", height)
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
        console.log("fff")
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
        swan.request({
            url: getApp().getUrl('/message/reply/'),
            method: 'POST',
            header: {
                // POST 携带
                'X-CSRFToken': cookies.get('csrftoken')
            },
            data: {content: this.data.thisSenderMsg},
            
            success: res => {
                setTimeout(() => {
                    this.scrollToBottomTemp()
                }, 400);
                console.log('sendMsg: ', res);
                if (res.statusCode != 200) {
                    swan.showModal({
                        title: '请求失败',
                        content: 'sendMsg Fail'
                    });
                    return;
                }
                this.updateData(res);
            },
            fail: err => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            }
        })
    },
    // CHOICE: send choice 
    selectChoice(e) {
        // update user's reply and u's reply 
        // console.log("select choice: ", e.currentTarget.dataset.choiceIndex);

        let choiceIndex = e.currentTarget.dataset.choiceIndex;
        let tempMsgs = this.data.displayMsgs;
        tempMsgs.push ({
            type:'0', 
            msg: this.data.uChRely[choiceIndex],
        }); 
        this.setData({
            displayMsgs: tempMsgs,
        })
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
                if (res.statusCode != 200) {
                    swan.showModal({
                        title: '请求失败',
                        content: 'sendMsg Fail'
                    });
                    return;
                }
                this.updateData(res);
            },
            fail: err => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            }
        })
    },
    
    updateData: function(res) {
        // used after POST to server
        // for xiaou's msg 
        let tempMsgs = this.data.displayMsgs;
        console.log("updateData");
        tempMsgs.push ({
            type:'1', 
            msg: res.data.message.content,
        }); 
        let tempCh = [];
        let tempChRe = [];
        // for choices
        if (res.data.question.reply_type == 1) {
            res.data.question.choices.forEach(element => {
                tempCh.push(element.title),
                tempChRe.push(element.reply_content)
            });
        }
        // update data 
        this.setData({
            displayMsgs: tempMsgs,
            doChoice: res.data.question.reply_type,
            uChoices: tempCh,
            uChRely: tempChRe,
        })
        setTimeout(() => {
            this.scrollToBottomTemp()
        }, 400);
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
        // this.pageScrollToBottom();

    },
    getQuestion: function(){
        swan.request({
            url: getApp().getUrl('/message/get_question/'),
            method: 'GET',
            success: res => {
                console.log('initial question: ', res);
                if (res.statusCode != 200) {
                    swan.showModal({
                        title: '请求失败',
                        content: 'sendMsg Fail'
                    });
                    return;
                }
                let tempDis = [{
                    type: "1",
                    msg: res.data.title
                }];
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
                })
                this.initial();

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
    
});