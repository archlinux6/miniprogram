// pages/home/home.js
Page({
  data: {

    indicatordots: true,/*加入图标指示点*/
    autoplay: true,/*自动切换图片开关*/
    interval: 5000,   /*切换时间属性5000=5秒*/
    
  },
  onLoad: function (options) {

  },
  tapOpenCamera() {
    wx.navigateTo({
      url: '../camera/camera',
    })
  },
  toTestPage: function(e){
    let testId = e.currentTarget.dataset['testid'];
    wx.navigateTo({
      url: '../test/test?testId='+testId
    })
  }
})