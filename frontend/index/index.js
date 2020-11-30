/**
 * @file demo component for animation-view
 * @author swan
 */

/* globals swan, getApp*/
let app = getApp();
/* eslint-disable */
Page({
    data: {
        hidden: 'false'
    },
    playArrow(e) {
        this.setData({
            hidden: 'true'
        })
    },
    goNext(e) {
        swan.redirectTo({
            url: 'index2/index2'
        })
    }
 
});