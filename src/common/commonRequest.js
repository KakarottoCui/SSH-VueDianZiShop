import Vue from 'vue'
import axios from 'axios'

const baseUrl = 'http://localhost:8087/NmEShop';

const urlMap = {
  login: baseUrl + '/login',
  logout: baseUrl + '/logout',
  loginCheck: baseUrl + '/getUserInfo',
  getUserData: baseUrl + '/getUserData',
  uploadFile: baseUrl + '/uploadFile',
  regist: baseUrl + '/regist',
  changePass: baseUrl + '/changePass',
  getLocationName: baseUrl + "/getLocationInfo?location=",//获取定位地点名
  
  getLocation: baseUrl + "/getLocation",//获取定位
  
  getPic : baseUrl + "/getFile/0/",
  getAudio : baseUrl + "/getFile/1/",
  localPic: baseUrl + "/static/img/",
  
  findNmEshopCartList: baseUrl+ "/nmEshopCart/queryList",
  findNmEshopCart: baseUrl+ "/nmEshopCart/queryObject",
  addNmEshopCart: baseUrl+ "/nmEshopCart/addNmEshopCart",
  editNmEshopCart: baseUrl+ "/nmEshopCart/editNmEshopCart",
  
  findNmGoodsList: baseUrl+ "/nmGoods/queryList",
  findNmGoods: baseUrl+ "/nmGoods/queryObject",
  addNmGoods: baseUrl+ "/nmGoods/addNmGoods",
  editNmGoods: baseUrl+ "/nmGoods/editNmGoods",
  
  findNmGoodsTypeList: baseUrl+ "/nmGoodsType/queryList",
  findNmGoodsType: baseUrl+ "/nmGoodsType/queryObject",
  addNmGoodsType: baseUrl+ "/nmGoodsType/addNmGoodsType",
  editNmGoodsType: baseUrl+ "/nmGoodsType/editNmGoodsType",
  
  findNmOrderList: baseUrl+ "/nmOrder/queryList",
  findNmOrder: baseUrl+ "/nmOrder/queryObject",
  addNmOrder: baseUrl+ "/nmOrder/addNmOrder",
  editNmOrder: baseUrl+ "/nmOrder/editNmOrder",
  createNmOrder: baseUrl+ "/nmOrder/createNmOrder",
  cancelNmOrder: baseUrl+ "/nmOrder/cancelNmOrder",
  
  findNmOrderItemList: baseUrl+ "/nmOrderItem/queryList",
  findNmOrderItem: baseUrl+ "/nmOrderItem/queryObject",
  addNmOrderItem: baseUrl+ "/nmOrderItem/addNmOrderItem",
  editNmOrderItem: baseUrl+ "/nmOrderItem/editNmOrderItem",
  
  findSysUserList:baseUrl + '/sysUser/queryList',
  findSysUser: baseUrl+ '/sysUser/queryObject',
  addSysUser: baseUrl + '/sysUser/addSysUser',
  editSysUser: baseUrl + '/sysUser/editSysUser',
  
  findNmEshopAddressList:baseUrl + '/nmEshopAddress/queryList',
  findNmEshopAddress: baseUrl+ '/nmEshopAddress/queryObject',
  addNmEshopAddress: baseUrl + '/nmEshopAddress/addNmEshopAddress',
  editNmEshopAddress: baseUrl + '/nmEshopAddress/editNmEshopAddress',
  
  findNmEshopCouponList:baseUrl + '/nmEshopCoupon/queryList',
  findNmEshopCoupon: baseUrl+ '/nmEshopCoupon/queryObject',
  addNmEshopCoupon: baseUrl + '/nmEshopCoupon/addNmEshopCoupon',
  editNmEshopCoupon: baseUrl + '/nmEshopCoupon/editNmEshopCoupon',
  addAllNmEshopCoupon: baseUrl + '/nmEshopCoupon/addAllNmEshopCoupon',
  
  findSysCarouselList:baseUrl + '/sysCarousel/queryList',
  findSysCarousel: baseUrl+ '/sysCarousel/queryObject',
  addSysCarousel: baseUrl + '/sysCarousel/addSysCarousel',
  editSysCarousel: baseUrl + '/sysCarousel/editSysCarousel',
  
  findNmEshopChatList:baseUrl + '/nmEshopChat/queryList',
  findNmEshopChat: baseUrl+ '/nmEshopChat/queryObject',
  addNmEshopChat: baseUrl + '/nmEshopChat/addNmEshopChat',
  editNmEshopChat: baseUrl + '/nmEshopChat/editNmEshopChat',
  findNmEshopChatList2:baseUrl + '/nmEshopChat/queryList2',
  
  findNmEshopComplaintList:baseUrl + '/nmEshopComplaint/queryList',
  findNmEshopComplaint: baseUrl+ '/nmEshopComplaint/queryObject',
  addNmEshopComplaint: baseUrl + '/nmEshopComplaint/addNmEshopComplaint',
  editNmEshopComplaint: baseUrl + '/nmEshopComplaint/editNmEshopComplaint',
  
  
  getFile : baseUrl + "/getFile/"
  //localPic: baseUrl + "/static/img/"
  
}
const addX = 39.923260746424354;
const addY = 116.33433023052703;

const request = function(requestOpt) {
  let loading;
  try {
    requestOpt = requestOpt || {};
    if (!requestOpt.url) {
      return;
    }
    var token = '';
    try {
      let value = localStorage.getItem('userInfo');
      if (value) {
        value = JSON.parse(value);
        token = value.token;
      }
    } catch (e) {
      token = '';
    }
    requestOpt.data = requestOpt.data || {};
    requestOpt.data['token'] = token;
    requestOpt.method = requestOpt.method || 'post';
    requestOpt.headers = requestOpt.headers || {
      //'content-type': 'application/x-www-form-urlencoded',
      'token': token
    };
    requestOpt.timeout = requestOpt.timeout || 30000;
    requestOpt.responseType = requestOpt.responseType || 'text';
    requestOpt.dataType = requestOpt.dataType || 'json';
    requestOpt.sslVerify = requestOpt.sslVerify || true;
    requestOpt.success = requestOpt.success || function(res) {};
    requestOpt.fail = requestOpt.fail || function(res) {};
    requestOpt.complete = requestOpt.complete || function(res) {};
	if(requestOpt.url.indexOf("nmEshopChat") < 0 ){
		loading = Vue.prototype.$baseLoading();
	}
    axios({
      method: requestOpt.method,
      url: requestOpt.url,
      headers: requestOpt.headers,
      data: requestOpt.data
    }).then(function(response) {
	if(requestOpt.url.indexOf("nmEshopChat") < 0 ){
		loading.close();
	}
      
      requestOpt.success(response);
      if (response.data.code == 401) {
        Vue.prototype.$baseMessage('未登录')
        localStorage.removeItem('user');
      }
    }).catch(function(error) {
      
	  if(requestOpt.url.indexOf("nmEshopChat") < 0 ){
	  	loading.close();
	  }
      requestOpt.fail(error);
    });
  } catch (e) {
    //TODO handle the exception
    loading.close();
    Vue.prototype.$baseMessage('网络请求异常')
  }
}

const getUrlParam = function(name) {
  var params = {}; // 存放参数的对象
  window.location.href.replace(/[?&]([^=#]+)=([^&#]*)/g, function (match, key, value) {
      params[key] = decodeURIComponent(value); // 将参数值进行解码
  });
	if (params[name]) {
		return params[name];
	}
	return null;
}

const getUserInfo = function(){
	let user = localStorage.getItem("userInfo");
	if(user){
		return JSON.parse(user);
	}else{
		err("登录过期，请重新登录");
		localStorage.removeItem("userInfo");
    return null;
	}
}

const msg = function(msg){
	Vue.prototype.$baseMessage(msg)
}

const err = function(msg){
	Vue.prototype.$baseMessage(msg)
}

const warn = function(msg){
	Vue.prototype.$baseMessage(msg)
}

const success = function(msg){
	Vue.prototype.$baseMessage(msg)
}

export default {
  request,
  baseUrl,
  urlMap,
  msg,
  err,
  warn,
  success,
  getUrlParam,
  getUserInfo,
  addX,
  addY
}
