// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './assets/css/reset.css'
import "./assets/css/common.less"
import "./assets/font/iconfont.css"
import common from './assets/js/common.js'
import 'lib-flexible'
import 'element-ui/lib/theme-chalk/index.css'; //elementCss
import ElementUI from 'element-ui';   // elementUI

import axios from 'axios' //ajax请求插件axios

import Viewer from 'v-viewer'
// import 'viewerjs/dist/viewer.css'


Vue.use(common);
Vue.use(ElementUI);

Vue.use(Viewer);
Viewer.setDefaults({
  Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
})

Vue.prototype.$ajax = axios;


try{
  getMessage(function(meth,message){
  // window.message = message;
  if(message === 'XYCodingmessage'){
    window.localStorage.setItem('message',message)
  }
  
 	console.log("子窗口回调999999999999999999999",meth,message)
})
}catch(e){
  //TODO handle the exception
}

Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
export { router,store}

