var app = getApp();
Page({
  data: {
    index: 1,  // 题目序列
    chooseValue: [], // 选择的答案序列
    totalCount: 0, // 总做题数
    totalScore:0,
    wrong: 0, // 错误的题目数量
    wrongList: [], // 错误的题目集合-乱序
    wrongListSort: [], // 错误的题目集合-正序
    job:[],
    jobList:[],
    id:'',
    isClick:false,
    jobStorage:[],
    jobId:'',
    inputData: null
  },


  onLoad: function (options) {
    console.log(options);
    wx.setNavigationBarTitle({ title: options.testId }) // 动态设置导航条标题
  
    this.setData({
      questionList: app.globalData.questionList[options.testId],  // 拿到答题数据
      testId: options.testId // 课程ID
    })
    console.log(this.data.questionList);
  
    let count = this.generateArray(0, this.data.questionList.length - 1); // 生成题序
    let num = this.data.questionList.length ; 
    this.setData({
      shuffleIndex: count.slice(0, num) // 生成顺序题序并截取num道题
    })
  },
  
  /*
  * 生成一个数字数组，从start到end
  */
  generateArray: function (start, end) {
    return Array.from(new Array(end + 1).keys()).slice(start);
  },
  

 
  /*
  * 单选事件
  */
  radioChange: function(e){
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.data.chooseValue[this.data.index] = e.detail.value;
    console.log(this.data.chooseValue);
  },
  /*
  * 多选事件
  */
  checkboxChange:function(e){
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.data.chooseValue[this.data.index] = e.detail.value.sort();
    console.log(this.data.chooseValue);
  },
  changeText:function(e){



        this.setData({
          index : e.detail.value,
      
        })
        
      setTimeout(()=>
      {
        this.setData({
          inputData : null
        })
      }, 1100)
     

     
      

},

 /*
  * 退出答题 按钮
  */
  outTest: function(){
      // 设置缓存
      var logs = wx.getStorageSync('logs') || []
      let logsList = { "date": Date.now(), "testId": this.data.testId, "count": this.data.totalCount }
      logs.unshift(logsList);
      wx.setStorageSync('logs', logs);
    wx.showModal({
      title: '提示',
      content: '你真的要退出答题吗？',
      success(res) {
                      
        if (res.confirm) {

          console.log('用户点击确定')
          wx.switchTab({
            url: '../index/index'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
//收藏
haveSave(e){
  if(!this.data.isClick == true){
    let jobData = this.data.jobStorage;
    jobData.push({
      jobid:jobData.length,
      id:this.data.job.id
    })
    wx.setStorageSync('jobData', jobData);
    wx.showToast({
      title: '已收藏',
    });
  }else{
    wx.showToast({
      title: '已取消收藏',
    })
  }
  this.setData({
    isClick:!this.data.isClick
  })
},


  submit: function(){
    if(this.data.chooseValue[this.data.index]　==　undefined){
      wx.showToast({
        title:  '请先提交答案哦',
        icon: 'none',
        duration: 2000,
        success: function(){
          return;
        }
      })
    }else if (this.data.chooseValue[this.data.index] !=  this.data.questionList[this.data.shuffleIndex[this.data.index]]['true'] ) {  
      wx.showToast({
        title: '你选择了' + this.data.chooseValue[this.data.index] + '，答案是' + this.data.questionList[this.data.shuffleIndex[this.data.index]]['true'] + '哦',
        icon: 'none',
        duration: 2000,
        success: function(){
          return;
        }
      })
      return;
    }else if(this.data.chooseValue[this.data.index] == this.data.questionList[this.data.shuffleIndex[this.data.index]]['true']　) {
      wx.showToast({
        title:  '答案是正确的哦，点击下一题吧',
        icon: 'none',
        duration: 2000,
        success: function(){
          return;
        }        
      })
    }
  },
  /*
  * 上一题/提交 按钮
  */
  lastSubmit: function(){
    if(this.data.chooseValue[this.data.index]　==　undefined){
      wx.showToast({
        title:  '请先提交答案哦',
        icon: 'none',
        duration: 2000,
        success: function(){
          return;
        }
      })
    }else{
        if(this.data.index > 1 ){
          this.setData({

            index: this.data.index - 1
          })
        }else{
              wx.showToast({
                title:  '前面没题目了哦',
                icon: 'none',
                duration: 2000,
                success: function(){
                  return;
                }
              })
              return;
        }
    }
  },
  /*
  * 下一题/提交 按钮
  */
  nextSubmit: function(){

    this.data.totalCount++;
    // 如果没有选择
    if(this.data.chooseValue[this.data.index]　==　undefined){
      wx.showToast({
        title:  '请先提交答案哦',
        icon: 'none',
        duration: 2000,
        success: function(){
          return;
        }
      })
    }else if (this.data.chooseValue[this.data.index] !=  this.data.questionList[this.data.shuffleIndex[this.data.index]]['true'] ) {  
      wx.showToast({
        title: '你选择了' + this.data.chooseValue[this.data.index] + '，答案是' + this.data.questionList[this.data.shuffleIndex[this.data.index]]['true'] + '哦',
        icon: 'none',
        duration: 2000,
        success: function(){
          return;
        }
      })
      return;
    }else if(this.data.chooseValue[this.data.index] == this.data.questionList[this.data.shuffleIndex[this.data.index]]['true']　) {
      wx.showToast({
        title: '答案正确',
        icon: 'none',
        duration: 2000,
        success: function(){
          return;
        }
        
      })
    }


    // 判断答案是否正确
    // this.chooseError();
    
    // 判断是不是最后一题
    if (this.data.index < this.data.shuffleIndex.length - 1 &&  this.data.chooseValue[this.data.index] == this.data.questionList[this.data.shuffleIndex[this.data.index]]['true']) {

      setTimeout(()=>
      {
        this.setData({

          index: this.data.index - 1
        })
        this.setData({
          index: this.data.index + 1
        })
        this.setData({
          index: this.data.index + 1
        })
      }, 700)
     

      // 渲染下一题
      
    } else if(this.data.index >= this.data.shuffleIndex.length - 1 ){
      let wrongList = JSON.stringify(this.data.wrongList);
      let wrongListSort = JSON.stringify(this.data.wrongListSort);
      let chooseValue = JSON.stringify(this.data.chooseValue);
      wx.navigateTo({
        url: '../wronglist/wronglist?totalScore=' + this.data.totalScore + '&wrongList=' + wrongList + '&chooseValue=' + chooseValue + '&wrongListSort=' + wrongListSort + '&testId=' + this.data.testId
      })


    }
  },
  /*
  * 错题处理
  */
  chooseError: function(){
    var trueValue = this.data.questionList[this.data.shuffleIndex[this.data.index]]['true'];
    var chooseVal = this.data.chooseValue[this.data.index];
    console.log('选择了' + chooseVal + '答案是' + trueValue);
    if (chooseVal.toString() != trueValue.toString()) {
      console.log('错了');
      this.data.wrong++;
      this.data.wrongListSort.push(this.data.index);
      this.data.wrongList.push(this.data.shuffleIndex[this.data.index]);
      this.setData({
        totalScore: this.data.totalScore - this.data.questionList[this.data.shuffleIndex[this.data.index]]['scores']  // 扣分操作
      })
    }
  
  }


})