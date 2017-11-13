/**
 * Created by lifetea on 16/9/20.
 */
// app.js

Vue                     =    require('Vue')

//网络请求
import vueResource from 'vue-resource'

Vue.use(vueResource)

Vue.http.options.emulateJSON = true

import Main             from '../view/Main.vue'

import router           from './router'


import { sync }         from 'vuex-router-sync'

import store            from  '../vuex/store'


//接口分发
Vue.debugUrl = "/admin"
Vue.agent = {
    "jing":"/jing",
    "jingDebug":"/jingDebug",
    "yang":"/yang",
    'mock':'mock',
    'beta':'beta',
    'root':'root'
}

//filter
System.import('./filter.js')

// sync(store, router)

// import axios from 'axios'



//初始化APP
var app = new Vue({
    el:"#main",
    router,
    store,
    render: h => h(Main),
})

