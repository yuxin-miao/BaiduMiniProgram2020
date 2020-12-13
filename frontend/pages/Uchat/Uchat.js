import 'weapp-cookie';
import cookies from 'weapp-cookie';
var util = require('../../utils/util.js');
import {MoodName} from '../../utils/constants.js';


Page({
    data: {
        time: '',
        scrollTop: 0,
        prevMsgs: [], // previous messages
        thisSenderMsg: '', // 即时输入
        thisDisplayMsg: '', // 发送/显示的用户信息
        displayMsgs: [], // item {type: msg: } 本次聊天所有信息 for both
        justEnter: '0', // 进入时的判断
        taskFinish: false,
        talkMatching: '0',
        whetherDetermineMatch: '0',
        nickname: "", // 通过是否有名字判断是否初次进入
        doChoice: '0', // 选择选项：1 / 纯输入：0 / 心情记录: 2 process_type
        uChoices: [], // choices given, array of strings
        uChRely: [], // reply by U after select a choice
        MoodName: ["smile", "like", "happy", "upset", "sad", "angry", "ok"],
        chatPaddingBottom: "10vh",
        chatHeight: 0,
        toolChoice: 0, // used for toolbox select 
    },
    onLoad: function () {
        //     // chat Animation
        // this.chatAni = swan.createAnimation({
        
        // })
        getApp().whetherWeb();
        swan.showLoading({
            title: '努力加载中',
            mask: true
        });
        var time = util.chatTime(new Date());
        this.setData({
            time: time
        }, () => {
            this.initial();
        });
    },
    onReady: function() {
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
    recordNav(e) {
        swan.navigateTo({
            url: '/pages/myCalender/myCalender'
        });
    },

    scrollToBottomTemp(callback){
        if(typeof callback != 'function') callback = function(){};
        let bottomHeight = 0;
        swan.createSelectorQuery().select('#uchat-bottom').boundingClientRect(rect => {
            // console.log("节点信息", rect);
            bottomHeight = rect.height;
        }).exec();

        let info = swan.getSystemInfoSync();
        if ((info instanceof Error)) {
            swan.showModal({
                title: '获取系统信息失败',
                content: '无法初始化聊天窗口',
            });
            return;
        }

        this.setData({ chatHeight: info.windowHeight - bottomHeight }, () => {
            // console.log("chatHeight", this.data.chatHeight);

            const selectorQuery = swan.createSelectorQuery();
            selectorQuery.selectAll('.chat-row').boundingClientRect();
            selectorQuery.exec(res => {
                const prevHeight = this.data.scrollTop;
                if (res[0][res[0].length-1].bottom < prevHeight) {
                    // 若高度检测未生效
                    // console.log("invalid", prevHeight);
                    this.setData({ scrollTop: prevHeight + 5000 }, ()=> {
                        // console.log("1 I will call!")
                        callback();
                    });
                } else {
                    // 若高度检测生效，则使用系统高度
                    // console.log("valid", res[0][res[0].length-1].bottom)
                    this.setData({ scrollTop: res[0][res[0].length-1].bottom }, ()=>{
                        // console.log("2 I will call!")

                        callback();
                    });
                }
            });
            // if (match == 1) {
            //     this.matchingQuestion(this.data.thisSenderMsg );
            // }
            // else if (match == 0) {
            //     this.notMatchingQuestion();
            // }
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
        }, ()=> {
            this.scrollToBottomTemp(this.updateSendMsg());
        });

    },
    updateSendMsg:function() {
        if (this.data.justEnter == "1") { // set nickname for first time enter user 
            if(this.data.thisSenderMsg.length > 5){
                swan.showToast({
                    title: '昵称长度不可大于五个字符',
                    icon: 'none',
                    duration: 1400
                })
                return;
            };
            // console.log('POST 11:', this.data.thisSenderMsg);

            swan.request({
                url: getApp().getUrl('/account/nickname/'),
                method: 'POST',
                header: {
                    // POST 携带
                    'X-CSRFToken': cookies.get('csrftoken')
                },
                data: {nickname: this.data.thisSenderMsg},
                success: res => {
                    // console.log("set nickname", this.data.thisSenderMsg);
                    this.setData({
                        nickname: this.data.thisSenderMsg
                    })
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
        else if (this.data.taskFinish == false) {
            if (this.data.whetherDetermineMatch === '0' || this.data.taskFinish ==  false) {
                // console.log('POST 22:', this.data.thisSenderMsg);
                swan.request({
                    url: getApp().getUrl('/message/reply/'),
                    method: 'POST',
                    header: {
                        // POST 携带
                        'X-CSRFToken': cookies.get('csrftoken')
                    },
                    data: {content: this.data.thisSenderMsg},
                    success: res => {
                        // console.log("sendMsg: res: ", res.data.message.content.length);
                        if (res.data.message.content.length != 0) {
                            this.allQuestionUpdate(res);
                            return;
                        }
                        else {
                            console.log("sendMsg: thisTaskFinish: ", this.data.taskFinish);
                            this.bye();
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
                                taskFinish: true,
                            }, () => {
                                this.scrollToBottomTemp();
                            })
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
            else if (this.data.taskFinish == true) {
                // console.log("sendMsg taskFinish", this.data.thisSenderMsg);
                this.scrollToBottomTemp();
                // this.matchingQuestion(this.data.thisSenderMsg);
                this.setData({
                    taskFinish: false
                })
            }
        }
    },
    // CHOICE: send choice
    selectChoice(e) {
        // update user's reply and u's reply
        // console.log('select choice: ', this.data.toolChoice, this.data.justEnter, this.data.taskFinish, this.data.whetherDetermineMatch, e.currentTarget.dataset.choiceIndex);
        let choiceIndex = e.currentTarget.dataset.choiceIndex;
        let tempMsgs = this.data.displayMsgs;
        tempMsgs.push ({
            type:'0',
            msg: this.data.uChRely[choiceIndex],
        });
        this.setData({
            displayMsgs: tempMsgs
        }, ()=> {
            this.scrollToBottomTemp(this.updateChoice(choiceIndex));
        })
    },
    updateChoice: function(choiceIndex) {
        let tempMsgs = this.data.displayMsgs;

        if (this.data.justEnter == "0" &&  this.data.taskFinish == false) {
            console.log('POST SC:', choiceIndex);
            swan.request({
                url: getApp().getUrl('/message/reply/'),
                method: 'POST',
                header: {
                    // POST 携带
                    'X-CSRFToken': cookies.get('csrftoken')
                },
                data: {content: choiceIndex},
                success: res => {
                    // console.log('selectChoice: ', res);
                    if (res.data.message.content.length != "") {
                        this.allQuestionUpdate(res);
                        return
                    }
                    this.bye();
                    tempMsgs.push({
                        type: '1',
                        msg: '有想和我聊聊的话题吗？'
                    });
                    let tempCh = ["有", "没有"];
                    let tempChRe = ["有", "没有"];
                    this.setData({
                        displayMsgs: tempMsgs,
                        doChoice: '1',
                        uChoices: tempCh,
                        uChRely: tempChRe,
                        taskFinish: true,
                    }, () => {
                        this.scrollToBottomTemp();
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
        // else if (this.data.toolChoice == 1) {
        //     console.log("tool");
        //     this.scrollToBottomTemp(this.notMatchingQuestion());
        //     // this.notMatchingQuestion();
        //     this.setData({
        //         toolChoice: 0
        //     })
        // }
        else if (this.data.taskFinish == true) {

            console.log("select+taskFinish", this.data.justEnter, this.data.taskFinish, this.data.whetherDetermineMatch, e.currentTarget.dataset.choiceIndex);

            if (choiceIndex == '0') {
                tempMsgs.push({
                    type: '1',
                    msg: '告诉我一个关键词...'
                });
                this.setData({
                    displayMsgs: tempMsgs,
                    doChoice: '0',
                    uChRely: [],
                    uChoices: [],
                    justEnter: '0',
                    taskFinish: true,
                }, () => {
                    this.scrollToBottomTemp();
                })
            }
            else {
                this.setData({
                    toolChoice: 0,
                })
                this.scrollToBottomTemp(this.notMatchingQuestion());
                // this.notMatchingQuestion();
            }
        }
        else if (this.data.whetherDetermineMatch === '0') {
            console.log("1whether");
                this.getInitialUpdateData(choiceIndex);
                return
        }
        else {
            swan.showModal({
                title: '请求失败',
                content: '请稍后重试'
            })
        }
    },
    initial: function() {
        swan.request({
            url: getApp().getUrl('/message/'),
            method: 'GET',
            success: res => {
                // console.log('initial record: ', res);
                if (res.statusCode != 200) {
                    swan.showModal({
                        title: '请求失败',
                        content: '请清理缓存后进入'
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
                }, () => {
                    this.getNickName();
                });
            },
            fail: err => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            },
            complete: () => {
                swan.hideLoading();
            }
        })

    },
    getInitialUpdateData: function(chIndex) { // 还未向服务器请求question
        let tempDis = this.data.displayMsgs;

        if (this.data.doChoice === '1' &&  this.data.taskFinish == false && chIndex == 0) {
            // 非初次进入+上次话题未结束+想继续聊
            // get last question
            this.getLastQuestion();

            this.setData({
                justEnter: '0',
            })
            return;
        }

        if (this.data.taskFinish == true) {    // 非初次进入+话题已经结束
            this.setData({
                justEnter: '0',
            });
            if (chIndex == '0') {
                //matching
                this.scrollToBottomTemp(this.matchingQuestion(this.data.thisSenderMsg ));
                // this.matchingQuestion(this.data.thisSenderMsg );
            }
            else {
                // not matching
                this.setData({
                    toolChoice: 0,
                })
                this.scrollToBottomTemp(this.notMatchingQuestion());
                // this.notMatchingQuestion();
            }
            return;
        };

          // 初次进入
        if (this.data.justEnter == "1" && chIndex == -1) { 
            // console.log("初次进入nickname", this.data.nickname);
            let tempMsg = this.data.nickname + '在我们聊天之前让我先来做个自我介绍吧';
            tempDis.push({
                type: '1',
                msg: tempMsg,
            }, {
                type: '1',
                msg: '我是对大学生心理困惑进行开导的机器人，通过心情记录、感恩日记、合理书写、等心理学方法，来帮助大学生们进行心理上的调整，缓解心理压力和负面情绪。',
            }, {
                type: '1',
                msg: '还有一点要提醒的是，我的聊天对象是存在短暂情绪/心理困扰的大学生群体，如果你感到有严重的心理困扰或者被诊断有心理疾病，请向专业心理医生寻求帮助喔！',
            });
            this.setData({
                displayMsgs: tempDis,
                uChoices: ['好喔'],
                uChRely: ['好喔'],
                doChoice: '1',
                whetherDetermineMatch: '1',
                taskFinish: true,
                toolChoice: 0,
            },() => {
                this.scrollToBottomTemp(this.notMatchingQuestion());
            });
            return;
        }
        // 非初次进入且选择重新开始
        this.bye();
        // this.notMatchingQuestion();
        this.setData({
            displayMsgs: tempDis,
            uChoices: [],
            uChRely: [],
            doChoice: '1',
            whetherDetermineMatch: '1',
            taskFinish: true,
            toolChoice: 1,
        },() => {
            this.scrollToBottomTemp(this.notMatchingQuestion());
        })


    },
    getNickName: function () {
        swan.request({
            url: getApp().getUrl('/account/user/'),
            method: 'GET',
            success: res => {
                if (res.statusCode != 200) {
                    // getApp().clearAndReenter(this);

                    // swan.showModal({
                    //     title: '加载中...',
                    //     content: ''
                    // })
                    swan.showModal({
                        title: '请求失败',
                        content: '请清理缓存后重新进入'
                    });
                    return;
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
        if(this.data.nickname === undefined || this.data.nickname === null || this.data.nickname === "" ) { // first enter
            let tempDis = [
                { type: "1", msg: "你好，我是小U" },
                { type: "1", msg: "怎么称呼你呢？"}
            ];

            this.setData({
                displayMsgs: tempDis,
                doChoice: '0',
            }, () => {
                this.scrollToBottomTemp();
            })
        }
        else {
            let tempMsg = this.data.nickname + "，欢迎回来！";
            let tempDis = [
                { type: "1", msg: tempMsg },
            ];
            swan.request({
                url: getApp().getUrl('/message/talk_finished/'),
                method: 'GET',
                success: res => {
                    if (res.statusCode != 200) {
                        swan.showModal({
                            title: "请求错误",
                            content: 'tempTaskFinish fail'
                        })
                        return;
                    }
                    if (res.data.talk_finished === false) {
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
                        }, () => {
                            this.scrollToBottomTemp();
                        })
                        // this.appendMsg(tempDis);
                    }
                    else {
                        this.bye();
                        this.setData({
                            displayMsgs: tempDis,
                            doChoice: '1',
                            uChoices: [],
                            uChRely: [],
                            taskFinish: res.data.talk_finished,
                        }, () => {
                            // let match = false;
                            this.scrollToBottomTemp(this.notMatchingQuestion());
                            // this.notMatchingQuestion();
                        });
                    }
                }
            })
        }
    },
    talkFinish: function() {
        swan.request({
            url: getApp().getUrl('/message/talk_finished/'),
            method: 'GET',
            success: res => {
                if (res.statusCode != 200 ) {
                    swan.showModal({
                        title: "请求失败",
                        content: "请清理缓存后重新进入"
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
            method: 'POST',
            header: {
                // POST 携带
                'X-CSRFToken': cookies.get('csrftoken')
            },
            success: res => {
                this.allQuestionUpdate(res);
                this.setData({
                    taskFinish: false,
                    justEnter: '0',
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

    matchingQuestion: function(toMatchMsg) {
        swan.request({
            url: getApp().getUrl('/message/get_question/'),
            method: 'POST',
            header: {
                // POST 携带
                'X-CSRFToken': cookies.get('csrftoken')
            },
            data: {matching: toMatchMsg},
            success: res => {
                this.allQuestionUpdate(res);
                this.setData({
                    taskFinish: false,
                    justEnter: '0',
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
    getLastQuestion: function(){
        swan.request({
            url: getApp().getUrl('/message/get_last_question/'),
            method: 'GET',
            success: res => {
                if (res.statusCode != 200) {
                    
                    swan.showModal({
                        title: '请求失败',
                        content: '请重新进入'
                    })
                }
                let tempDis = this.data.displayMsgs;
                tempDis.push({
                    type: '1',
                    msg: res.data.title
                })
                let tempCh = [];
                let tempChRe = [];
                if (res.data.process_type == '2') {    // 心情日记
                    this.setData({
                        displayMsgs: tempDis,
                        uChoices: tempCh,
                        uChRely: ['smile', 'like', 'happy', 'upset', 'sad', 'angry', 'ok'],
                        doChoice: '2',
                        justEnter: '0',
                    },() => {
                        this.scrollToBottomTemp();
                    })
                    return;
                }
                else if (res.data.reply_type == '1') {
                    res.data.choices.forEach( element => {
                        tempCh.push(element.title);
                        tempChRe.push(element.reply_content);
                    })
                }
                this.setData({
                    displayMsgs: tempDis,
                    uChoices: tempChRe,
                    uChRely: tempChRe,
                    taskFinish: false,
                    doChoice: res.data.reply_type,
                }, () => {
                    this.scrollToBottomTemp();
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
    allQuestionUpdate: function(res) {
        if (res.statusCode != 200) {
            // this.clearAndReenter(this.allQuestionUpdate(res));
            swan.showModal({
                title: '请求失败',
                content: '问题更新失败，请稍后再试'
            });
            return;
        }
        let tempDis = this.data.displayMsgs;
        tempDis.push({
            type: "1",
            msg: res.data.message.content
        });
        let tempCh = [];
        let tempChRe = [];
        if (res.data.question.process_type == '2') {    // 心情日记
            // console.log("allQuestionUpdate心情日记");
            this.setData({
                displayMsgs: tempDis,
                uChoices: tempCh,
                uChRely: ['smile', 'like', 'happy', 'upset', 'sad', 'angry', 'ok'],
                doChoice: '2',
                justEnter: '0',
            },() => {
                this.scrollToBottomTemp();
            })
            return;
        }

        else if (res.data.question.reply_type == 1) {
            res.data.question.choices.forEach(element => {
                tempCh.push(element.title),
                tempChRe.push(element.reply_content)
            })
        }
        // console.log(res.data.question.reply_type);
        this.setData({
            displayMsgs: tempDis,
            uChoices: tempCh,
            uChRely: tempChRe,
            doChoice: res.data.question.reply_type,
            justEnter: '0',
        },() => {
            this.scrollToBottomTemp();
        })
    },

    scrollToTop(e) {
        this.setData({ scrollTop: 0 });
    },

    bye: function() {
        swan.request({
            url: getApp().getUrl('/message/bye/'),
            method: 'POST',
            header: {
                // POST 携带
                'X-CSRFToken': cookies.get('csrftoken')
            },
            success: res => {
                if (res.statusCode != 200) {
                    // this.clearAndReenter(this.bye());
                    // swan.showModal({
                    //     title: '请求失败',
                    //     content: 'bye fail'
                    // })
                }
                // console.log("bye", res);
            },
            fail: err => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            }
        })
    },

    clearAndReenter(toSuc) {

        cookies.clearCookies();
        swan.clearStorageSync('username');
        swan.clearStorageSync('avatar');
        swan.clearStorageSync('gender');
        swan.login({
            success: res => {
                swan.showLoading({
                    title: '加载中'
                });

                let code = res.code || '';

                swan.request({
                    url: this.getUrl('/account/login/'),
                    method: 'POST',
                    data: {
                        code
                    },
                    success: res => {
                        let openID = res.data && res.data.openid;
                        this.setLocalStorage('username', res.data.username);
                        this.setLocalStorage('avatar', res.data.avatar);
                        this.setLocalStorage('gender', res.data.gender);

                        if (!openID) {
                            swan.showModal({
                                title: '请求失败',
                                content: '请退出账号后重试',
                            });
                            swan.hideLoading();
                            return;
                        }
                        this.setLocalStorage('openID', openID);
                        swan.hideLoading();
                        // swan.showToast({
                        //     title: '登录成功'
                        // });
                        toSuc();
                    },
                    fail: err => {
                        swan.showModal({
                            title: '网络异常',
                            content: '请检查网络连接'
                        });
                        swan.hideLoading();
                        toFail();
                    }
                });
            },
            fail: err => {
                swan.showModal({
                    title: '请求失败',
                    content: '百度授权失败'
                });
                swan.hideLoading();
            }
        });
    },

});