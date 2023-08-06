Page({
  data: {
    loading: false,
    contact: '',
    contant: ''
  },
  formSubmit: function (e) {
    let _that = this;
    let content = e.detail.value.opinion;
    let contact = e.detail.value.contact;
    let regPhone = /^1[3578]\d{9}$/;
    let regEmail = /^[a-z\d_\-\.]+@[a-z\d_\-]+\.[a-z\d_\-]+$/i;
    if (content == "") {
      wx.showModal({
        title: '提示',
        content: '反馈内容不能为空!',
      })
      return false
    }
    if (contact == "") {
      wx.showModal({
        title: '提示',
        content: '手机号或者邮箱不能为空!',
      })
      return false
    }
    if(contact == "" && content == "") {
      wx.showModal({
        title: '提示',
        content: '反馈内容,手机号或者邮箱不能为空!',
      })
      return false
    }
    if ((!regPhone.test(contact) && !regEmail.test(contact)) || (regPhone.test(contact) && regEmail.test(contact))) { //验证手机号或者邮箱的其中一个对
      wx.showModal({
        title: '提示',
        content: '您输入的手机号或者邮箱有误!',
      })
      return false
    } else {
      this.setData({
        loading: true
      })

      var n = wx.getStorageSync("userinfo");

      let nickname;
    
      //当本地缓存的用户名称不为""或者null时，设置userinfo信息
      if(n.nickName != '' && n.nickName != null){
          nickname = n.nickName;
      }
    let status = false;
      wx.request({
        url: '后台api地址，需自行填写',
        method: 'POST',
        data: {
          "content": content,  
          "contact": contact,
          "nickname":nickname
        },
        success: function (res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: '反馈成功',
              icon: 'success',
              duration: 1000,
              success: function (res) {
                //提示框消失后返回上一级页面
                setTimeout(() => {
                    wx.navigateBack({
                      change: true,
                    })
                }, 1200)
             }
           })
          }else{
            wx.showToast({
                title: '反馈失败，请稍后再试',
                icon: 'error',
                duration: 1200
              });
          }
        },
        fail: function () {
            wx.showToast({
                title: '请求失败~请联系客服',
                icon: 'error',
                duration: 1500
            })
        }
      })
      return status;
    }
  },
  handleContact (e) {
      console.log(e.detail.path)
      console.log(e.detail.query)
  }
})