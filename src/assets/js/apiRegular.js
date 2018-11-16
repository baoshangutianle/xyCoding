export const apiUrl = 'http://58.247.47.154:9527'; //二维码测试环境
//export const apiUrl = 'http://api.yogu101.com';//优股生产
//export const apiUrl = 'http://www.yidao007.com';//优股预发布
// export const apiUrl2 = 'http://120.27.198.61:8080/xycoding/ESBServlet'; //xycoding测试环境
export const apiUrl2 = 'http://120.27.198.61:8080/xycoding/JSONP'; //xycoding测试环境

export const getMyImformationListAPI = "cms.SelectObjectiveInfo"; // 我的进入资讯——获取我的资讯列表
export const getQr2API = apiUrl + '/ifop/GetQRCodeLogin';//登录——获取二维码字符串接口
export const watchLoginAPI = apiUrl + "/ifop/QueryLoginResult";//登录——轮询登录接口
export const regUrl = apiUrl + '/ifop/WxAuthLogin?oid=xyc_test'
export const UploadFile = 'http://120.27.198.61:8080/xycoding/UploadFile'

/**
 * api
 * http://120.27.198.61:8080
 * api2
 * http://58.247.47.154:9527
 */
// const API1 = 'api'
// const API2 = 'api2'

// export const apiUrl = API2; //二维码测试环境
// //export const apiUrl = 'http://api.yogu101.com';//优股生产
// //export const apiUrl = 'http://www.yidao007.com';//优股预发布
// // export const apiUrl2 = 'http://120.27.198.61:8080/xycoding/ESBServlet'; //xycoding测试环境
// export const apiUrl2 = API1 +'/xycoding/JSONP'; //xycoding测试环境

// export const getMyImformationListAPI = "cms.SelectObjectiveInfo"; // 我的进入资讯——获取我的资讯列表
// export const getQr2API = apiUrl + '/ifop/GetQRCodeLogin';//登录——获取二维码字符串接口
// export const watchLoginAPI = apiUrl + "/ifop/QueryLoginResult";//登录——轮询登录接口
// export const regUrl = apiUrl + '/ifop/WxAuthLogin?oid=xyc_test'
// export const UploadFile = API1 + '/xycoding/UploadFile'




export const objToStrUrl = function (obj) {
  let str = [];
  for (let i in obj) {
    str.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
  }
  return str.join("&");
};



export const checkMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;

//yyymmmddHHMMt
export function _ymdsfFilter(input) {
  console.log('fsdfasd', input);
  if (input != "" && input != null && input != undefined && input != "--") {
    if (input.indexOf("-", 0) == -1) {
      var year = input.toString().substr(0, 4);
      var month = input.toString().substr(4, 2);
      var day = input.toString().substr(6, 2);
      var shi = input.toString().substr(9, 2);
      var fen = input.toString().substr(12, 2);
      return year + month + day + shi + fen;
    }
    else {
      var year = input.toString().substr(0, 4);
      var month = input.toString().substr(5, 2);
      var day = input.toString().substr(8, 2);
      var shi = input.toString().substr(11, 2);
      var fen = input.toString().substr(14, 2);
      return year + month + day + shi + fen;
    }
  }
  else {
    return "--";
  }
}

//yyyymmdd
export function ymdfilter(input) {

  if (input != "" && input != null && input != undefined && input != "--") {
    if (input.indexOf("-", 0) == -1) {
      var year = input.toString().substr(0, 4);
      var month = input.toString().substr(4, 2);
      var day = input.toString().substr(6, 2);
      return year + month + day;
    }
    else {
      var year = input.toString().substr(0, 4);
      var month = input.toString().substr(5, 2);
      var day = input.toString().substr(8, 2);
      return year + month + day;
    }
  }
  else {
    return "--";
  }
}

//yyymmmddHHMM 转 yyyy-mm-dd HH:MM
export function _UymdsfFilter(input) {
  if (input != "" && input != null && input != undefined && input != "--") {
    var year = input.toString().substr(0, 4);
    var month = input.toString().substr(4, 2);
    var day = input.toString().substr(6, 2);
    var hour = input.toString().substr(8, 2);
    var muni = input.toString().substr(10, 2);
    var sel = '-';
    var str = year + sel + month + sel + day + ' ' + hour + ':' + muni;
    return str
  }
  else {
    return "--";
  }
}

//yyyymmdd转yyyy-mm-dd
export function Uymdfilter(input) {

  if (input != "" && input != null && input != undefined && input != "--") {
    var year = input.toString().substr(0, 4);
    var month = input.toString().substr(4, 2);
    var day = input.toString().substr(6, 2);
    var sel = '-';
    return year + sel + month + sel + day;

  }
  else {
    return "--";
  }
}

export function getDayTime(time,hour) {
  // console.log('time', time)
  let date = new Date(time);
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if(h >= 0 && h <= 9){
    h = "0" + h;
  }
  if(m >= 0 && m <= 9){
    m = "0" + m;
  }
  if(s >= 0 && s <= 9){
    s = "0" + s;
  }
  var currentdate;
  if(hour){
    currentdate = h + ':' + m + ':' + s;
  }else{
    currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + h + ':' + m + ':' + s;
    ;
  }

  return currentdate;
}


