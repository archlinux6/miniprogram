Page({
  data: {
  },

  // 拍照
  takePhoto: function () {
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        // 带上临时路径跳转到结果页
        wx.navigateTo({
          url: `../result/result?path=${res.tempImagePath}`
        });
        
        // 在页面显示原图
        this.setData({
          tempImagePath: res.tempImagePath
        });

        // 裁剪图片
        this.cropImage(res.tempImagePath);
      }
    });
  },

  // 裁剪图片
  cropImage: function (imagePath) {
    let that = this;
    wx.getImageInfo({
      src: imagePath,
      success: function (res) {
        const ctx = wx.createCanvasContext('myCanvas', that);
        // 获取系统信息，计算画布宽高及坐标
        wx.getSystemInfo({
          success: function (sysRes) {
            let windowWidth = sysRes.windowWidth;
            let windowHeight = sysRes.windowHeight;

            // 图片缩放比例
            let ratio = 2;

            // 计算图片绘制区域起始坐标和宽高
            let x = windowWidth / 2 - 100;
            let y = windowHeight / 2 - 150;
            let width = 200 * ratio;
            let height = 300 * ratio;

            // 绘制图片裁剪区域
            ctx.rect(x, y, width, height);

            // 将裁剪区域以外的部分设为透明
            ctx.setFillStyle('white');
            ctx.fillRect(0, 0, sysRes.windowWidth, sysRes.windowHeight);
            ctx.fill('evenodd');

            // 绘制图片
            ctx.drawImage(imagePath, x, y, width, height);

            // 绘制完成后将canvas保存为本地图片
            ctx.draw(false, function () {
              wx.canvasToTempFilePath({
                x: x,
                y: y,
                width: width,
                height: height,
                destWidth: width,
                destHeight: height,
                canvasId: 'myCanvas',
                success: function (res) {
                  that.setData({
                    croppedImagePath: res.tempFilePath
                  });
                },
                fail: function (res) {
                  console.log(res);
                }
              }, that);
            });
          }
        });
      },
      fail: function (err) {
        console.log(err);
      }
    });
  }
})
