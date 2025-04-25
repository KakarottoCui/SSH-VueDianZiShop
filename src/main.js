import Vue from 'vue';
import axios from "axios";
import App from './App.vue'
import './registerServiceWorker'
import plugins from './plugins'
import router from './router'
import store from './store'
import echarts from './assets/js/echarts.min.js'
import { Loading,Message } from 'element-ui'
import commonReq from './common/commonRequest.js'

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.use(plugins, {
	host: "",
	// host: "http://localhost:5000/"
});

  /* 全局加载层 */
Vue.prototype.$baseLoading = (index, text) => {
let loadingText = "加载中";
let loading
if (!index) {
  loading = Loading.service({
	lock: true,
	text: text || loadingText,
	background: 'hsla(0,0%,100%,.8)',
  })
} else {
  loading = Loading.service({
	lock: true,
	text: text || loadingText,
	spinner: `vab-loading-type${index}`,
	background: 'hsla(0,0%,100%,.8)',
  })
}
return loading
}

/* 全局Message */
Vue.prototype.$baseMessage = (message, type) => {
Message({
  offset: 60,
  showClose: true,
  message: message,
  type: type,
  dangerouslyUseHTMLString: true,
  duration: 2000,
})
}

Vue.prototype.siteTitle = "糯米电子交易"

Vue.prototype.commonReq = commonReq;

new Vue({
  router,
  store,
  echarts,
  render: h => h(App)
}).$mount('#app')
