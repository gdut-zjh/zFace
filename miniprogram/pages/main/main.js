Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: false, // 识别成功/失败
    img_url: '',
    Age: '',
    Expression: '',
    Gender: '',
    Beauty: '',
    Glass: ''
  },

  // 点击开始识别
  doUpload: function() {
    var myThis = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log(res);
        wx.showLoading({
          title: '正在识别',
        });
        // 上传图片
        const filePath = res.tempFilePaths[0];
        const cloudPath = 'img' + new Date().getTime() + filePath.match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          cloudPath: cloudPath, // 云存储路径
          filePath: filePath, // 要上传文件资源的路径
          success: res => {
            console.log(res);
            // 调用写好的云函数，生成图片的临时网络链接和调用腾讯云人脸识别api
            wx.cloud.callFunction({
              name: 'Face_Detection',
              data: {
                fileID: res.fileID
              },
              success: res => {
                console.log(res);
                myThis.setData({
                  Age: res.result.datas.FaceInfos[0].FaceAttributesInfo.Age,
                  Expression: res.result.datas.FaceInfos[0].FaceAttributesInfo.Expression,
                  Gender: res.result.datas.FaceInfos[0].FaceAttributesInfo.Gender,
                  Beauty: res.result.datas.FaceInfos[0].FaceAttributesInfo.Beauty,
                  Glass: res.result.datas.FaceInfos[0].FaceAttributesInfo.Glass,
                  status: true,
                  img_url: res.result.url
                })
              },
              complete: () => {
                wx.hideLoading();
              }
            });
          },
        });
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.cloud.init({
      env: 'zface-65a71f'
    })
  },

})