// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'babel-polyfill'
// import Es6Promise from 'es6-promise'
// Es6Promise.polyfill()
// import 'babel-polyfill'
// import Es6Promise from 'es6-promise'
// require('es6-promise').polyfill()
// Es6Promise.polyfill()
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import axios from 'axios'
// import '../static/render/css/mui.css';
import App from './App'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import MyPluginAddConfig from './myPlugin';
import XLSX from 'xlsx'
import FileSaver  from 'file-saver';
import ScriptLoader from 'script-loader'

// import date from '../static/js/date'
import home from './components/home'
import login from "./components/login"
import host from "./components/host"
import bolt from './components/bolt'
import CloseBolt from './components/CloseBolt'
import AlreadyBolt from  './components/AlreadyBolt'
import AlreadyClose from  './components/AlreadyClose'
import Set from './components/Set'
import NoPay from './components/NoPay'
import ResetNews from './components/ResetNews'
import ResetPassword from './components/ResetPassword'
import page from './components/bolt'
import Blob from './vendor/Blob'
import Export2Excel from './vendor/Export2Excel'




import '../static/css/global.css'
// import '../static/css/duo.css'

Vue.config.productionTip = false

Vue.use(Vuex);
Vue.use(VueRouter)
Vue.use(MintUI)
Vue.use(XLSX)
Vue.use(ScriptLoader)

Vue.prototype.$http=axios
// Vue.prototype.$=jquery
Vue.use(MyPluginAddConfig);
// Vue.use(date);
const routes=[
  {path:'/',component:login},
  {path: "/login", component: login},
  {path:'/home', name:"homeLink",component: home},
  {path:'/host',component: host},
  {path:'/bolt', name:"boltLink",component: bolt},
  {path:'/closebolt', name:"closeboltLink",component: CloseBolt},
  {path:'/alreadybolt', name:"alreadyboltLink",component: AlreadyBolt},
  {path:'/alreadyclose', name:"alreadycloseLink",component: AlreadyClose},
  {path:'/nopay', name:"nopayLink",component: NoPay},
  {path:'/set', name:"setLink",component: Set},
  {path:'/resetnews', name:"resetnewsLink",component: ResetNews},
  {path:'/resetpassword', name:"resetpasswordLink",component: ResetPassword},
  {path:'/page', name:"pageLink",component: page},


]
const router = new VueRouter({
  routes,
  // mode:'hash',
})

var store = new Vuex.Store({
  state: {
    // UserInfo:{}, //登陆用户信息
    UserInfo:0,
    User:{},
    communityID:null,
    // UserInfo: {UserName:"aadmin",Telephone:212121212122,FamilyName:"用户名"},
    Permisions: [],//用户权限
    // assign: false,//工单分派权限
    sideBarOpened: false,
    saveWorkBill: "",
    // ========================判断手机平台
    isIOS: false,
    oldPassword:"111111",
    newPassword:"",
    agginPassword:"",
    // datas:[],
    isChecked: false,
    //判断是否在登录页面跳转
    isLogin: false,
    isNewWorkOrder: false,
    operateType: false,//工单操作状态
    reactConfirm:null,
    workBillIndex: null,//选中工单号
    message:0, //总共的开关任务
    timeStart:'',
    timeEnd:'',
  },
  getters: {
    changeState: state => {
      //相当于vue实例中的methods,用于处理公用data
      //自vuex 面向组件的数据处理
    },
    count(state) {
      return state.count += 100
    }
  },
  mutations: {
    //写法与getters相类似
    //组件想要对于vuex 中的数据进行的处理
    //组件中采用this.$store.commit('方法名') 的方式调用，实现充分解耦
    //内部操作必须在此刻完成(同步)
    add(state) {
      state.count += 1;
      console.log(state.count)
    },
    reduce(state) {
      state.count -= 1;
      console.log(state.count)
    },
    //接收到新工单
    acceptNewWorkOrder(state) {
      state.isNewWorkOrder = true
    },
    //新工单已查看
    checked(state) {
      state.isChecked = true
    }
  },
  actions: {
    //使得mutations能够实现异步调用，实现例如延迟调用
    increment({ commit }, payload) {
      commit('突变方法名')
      //payload应该是一个对象，可通过模板方法调用传入对象的方式将数据从组件传入vuex
    },
    asyncIncrement({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    }
  },
  modules: {
    //引入某一个state的以上集合的模块，会自动分别填充到上面，使得结构更加清晰
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  render:h => h(App)
})

import { Toast } from "mint-ui";

Vue.directive('lfcous', function (el, pra, a) {
  if ($(".mint-field-core").eq(-1).val()) {
    let valueLength = $(".mint-field-core").eq(-1).val().length
    if (valueLength >= 100) {
      try {
        plus.nativeUI.toast("输入字数不得超过100字");
      } catch (e) {
        Toast("输入字数不得超过100字")
      }
    }
    a.context.$store.ReplyResultDelete = true
    a.context.valueLength = valueLength
  } else {
    a.context.valueLength = 0
  }
  if(a.context.$store.wordOrderReplyResult){
    if(!a.context.$store.ReplyResultDelete){
      $(".mint-field-core").eq(-1).val(a.context.$store.wordOrderReplyResult)
    }
  }

})
