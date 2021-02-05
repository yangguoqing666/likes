import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import jwtDecode from 'jwt-decode';
import cookie from 'react-cookie';
import axios from 'axios';
import configureStore from './common/store/configureStore';
import routes from './routes';
import { NEED_AUTH, MULTI_LOGIN } from '../common/constant';
import { handleUserLogout }  from './common/actions/auth';
import { showMsg } from './common/actions/globalmsg';

// 清除生产环境 console.log
if(process.env.NODE_ENV === "production"){
  console.log = function(){};
}

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};


let store;

const token = cookie.load('token');

if (token) {
  let initialState = { auth: {} };
  try {
    let d =new Date();
    const decoded = jwtDecode(token);
    const exp = parseInt(d.getTime()/1000);
    //console.log('token decoded='+JSON.stringify(decoded)+ ' exp='+ decoded.exp+ ' expiredate='+ (new Date(decoded.exp)));
    //console.log('now ='+d+ ' expiredate='+ parseInt(d.getTime()/1000));
    // initialState.auth.token = decoded.token;
    if ( exp <  decoded.exp) {
      initialState.auth.token = token;
      initialState.auth.id = decoded.id;
      initialState.auth.nickname = decoded.nickname;
      initialState.auth.email = decoded.email;
      initialState.auth.mobile = decoded.mobile;
      initialState.auth.avatar = decoded.avatar;
      initialState.auth.roles = decoded.roles;
      initialState.auth.qiyeid = decoded.qiyeid;
      initialState.auth.isAuthenticated = true;
      initialState.auth.istob=decoded.istob;
      initialState.auth.iskaoshi=decoded.iskaoshi;
      initialState.auth.fengongsiid=decoded.fengongsiid;
    }
  } catch (error) {
    console.log('app.jsx error=' + error);
  }
  store = configureStore(browserHistory, initialState );
} else {
  store = configureStore(browserHistory, window.__INITIAL_STATE__);
}


// Add a response interceptor
axios.interceptors.response.use(function (response) {
  //);console.log('axios.interceptors.responsedata.status='+response.data.status
  if (response && response.data) {
    let msgContent = '';
    if(response.data.status === NEED_AUTH) {
      msgContent = '认证期满，您需要重新登录';
    }
    else if(response.data.status === MULTI_LOGIN) {
      msgContent = '帐号在其他地方登录，本次登录信息失效';
    }

    if(msgContent != '') {
      store.dispatch(showMsg({type: 'error', content: msgContent}));
      //browserHistory.push("/admin/login");
      store.dispatch(handleUserLogout());
      return;
    }
  }
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});


const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider  store={store} >
    <Router history={history} routes={routes(store, true)} />
  </Provider>,
  document.getElementById('main')
);








