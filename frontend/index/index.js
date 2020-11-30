/**
 * @file demo component for animation-view
 * @author swan
 */

/* globals swan, getApp*/
let app = getApp();
/* eslint-disable */
Page({
    data: {
        hiddenarrow: 'true',
        hidden1: 'false',
        hidden2: 'true',
        play2: 'false',
        hiddenarrow2: 'true',
        autoplay2: 'false',
        autoplay3: 'false',
        play3: 'false',
        hidden3: 'true'
    },
    playArrow(e) {
        this.setData({
            hiddenarrow: 'false',
        })
    },
    goNext1(e) {
        console.log("xx")
        this.setData({
            hidden1: 'true',
            hidden2: 'false',
            hiddenarrow: 'true',
            play2: 'play',
            autoplay2: 'true'
        })
    },    
    playArrow2(e) {
        this.setData({
            hiddenarrow2: 'false',
        })
    },
    goNext2(e) {
        console.log("xx")
        this.setData({
            hidden2: 'true',
            hiddenarrow2: 'true',
            play3: 'play',
            autoplay3: 'true',
            hidden3: 'false'
        })
    },
    playArrow3(e) {
        swan.redirectTo({
            url: '/pages/main/main'
        })
    },
});