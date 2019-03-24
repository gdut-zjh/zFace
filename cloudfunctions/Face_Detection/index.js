const cloud = require('wx-server-sdk'); // 小程序云开发SDK
// 引入名为tencentcloud-sdk-nodejs的包文件，这个是腾讯云SDK所依赖的文件
const tencentcloud = require("tencentcloud-sdk-nodejs");
cloud.init(); // 云开发初始化
var synDetectFace = function(url) { //调用人脸识别API函数
  const IaiClient = tencentcloud.iai.v20180301.Client; //API版本
  const models = tencentcloud.iai.v20180301.Models; //API版本

  const Credential = tencentcloud.common.Credential;
  const ClientProfile = tencentcloud.common.ClientProfile;
  const HttpProfile = tencentcloud.common.HttpProfile;
  let cred = new Credential("AKIDLVyB9BIfYEgusaHnRr1xeMs80e3DvngN", "d2C7nDNJ4g4TfbHivufBTWKsAD1auzoP"); //腾讯云的SecretId和SecretKey
  let httpProfile = new HttpProfile();
  httpProfile.endpoint = "iai.tencentcloudapi.com"; //腾讯云人脸识别API接口
  let clientProfile = new ClientProfile();
  clientProfile.httpProfile = httpProfile;
  let client = new IaiClient(cred, "", clientProfile);

  let req = new models.DetectFaceRequest();
  let params = '{"Url":"' + url + '","NeedFaceAttributes":1,"NeedQualityDetection": 1}';
  req.from_json_string(params);

  return new Promise(function(resolve, reject) {
    client.DetectFace(req, function(errMsg, response) {
      if (errMsg) {
        reject(errMsg);
      }else{
        resolve(response);
      }
    });
  });
}

// 云函数入口函数
exports.main = async(event, context) => {
  const data = event;
  const fileList = [data.fileID]; // 读取来自客户端的fileID
  const result = await cloud.getTempFileURL({
    fileList, // 想云存储发起读取文件临时地址请求
  });
  const url = result.fileList[0].tempFileURL;
  datas = await synDetectFace(url);
  // return datas;
  return {
    datas,
    url
  }
}