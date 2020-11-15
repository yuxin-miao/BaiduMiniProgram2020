/**
 * @file demo component for detail
 * @author swan
 */

let app = getApp();

Page({
    data: {
        id: 'detail'
    },
    onLoad(options) {
        console.log(getCurrentPages());
        this.setData({
            'id': options.id
        });
    },
    navigateBack(e) {
        swan.navigateBack({
            delta: 2
        });
    }
});
