/**
 * Created by lifetea on 2016/10/8.
 */

let Vue             =   require('Vue')

import VueRouter    from  'vue-router'

import auth         from  './auth'

//挂载vue-router
Vue.use(VueRouter);

//布局
import Layout       from '../view/Com/Layout.vue'
//lazy load
const lazyLoading = (name, index = false) => () => System.import(`../view/${name}${index ? '/index' : ''}.vue`)


// session 失效跳转 401 没起啊   403  禁止访问
Vue.http.interceptors.push((request, next) => {
    //设置header
    request.headers.set('device', "1");
    if (auth.getToken()) {
        request.headers.set('authorization',auth.getToken());
    }
    next((res) => {
        // 401 token 失效 要登录
        // 402 token 有效 没有权限
        // if(res.body.code == 400 && res.body.message == '请登录'){
        //     alert("登录失效")
        //     setTimeout(function () {
        //         window.location.hash = "#/login"
        //     },200)
        // }
        if(res.status == 0){
            Vue.prototype.$notify({title: '提示',message: '服务端响应超时',type: 'warning'});
        }
        if(res.body.code == 400){
            Vue.prototype.$notify({title: '失败',message: res.body.message,type: 'error'});
        }
        if(res.body.code == 401){
            Vue.prototype.$notify({title: '提示',message: '登录过期咯',type: 'warning'});
            setTimeout(function () {
                window.location.hash = "#/login"
            },200)
        }
        if(res.body.code == 402){
            Vue.prototype.$notify({title: '提示',message: '你没有权限哦',type: 'warning'});
        }

        if(res.body.code == 200){
            auth.touchToken()
        }

    });
});

//要求登录
function requireAuth (to, from, next) {
    if (!auth.loggedIn()) {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    } else {
        next()
    }
}


export let list = [
    {
        icon:"ios-navigate",
        index:"1",
        name:'首页',
        funcId:'R010000',
        redirect: '/index-dashboad',
        children:[
            {
                name:"index-dashboad",
                alias:"主页",
                funcId:'R010100',
                index:'1-1',
                path:'index-dashboad',
                component: lazyLoading('Pages/Index/Index'),
            },
            {
                name:"index-todo-task",
                alias:"待处理任务",
                funcId:'R010200',
                index:'1-2',
                path:'index-todo-task',
                component: lazyLoading('Pages/Index/ToDoTask'),
            },
            {
                name:"index-wait-approve",
                alias:"待处理任务",
                funcId:'R010300',
                index:'1-3',
                path:'index-wait-approve',
                component: lazyLoading('Pages/Index/WaitApprove'),
            },
            {
                name:"index-approve",
                alias:"审批页面",
                index:'1-4',
                funcId:'R010400',
                path:'index-approve',
                component: lazyLoading('Pages/Approve/Approve'),
            },
        ]
    },
    {
        icon:"ios-person",
        name:"客户管理",
        index:'4',
        funcId:'R040000',
        redirect: '/member-personal',
        // role:0,
        children:[
            {
                name:"member-personal",
                alias:"个人客户",
                index:'4-1',
                funcId:'R040100',
                path:'member-personal',
                component: lazyLoading('Pages/Member/Personal'),
            },
            // {
            //     name:"member-company",
            //     alias:"机构管理",
            //     index:'5-2',
            //     path:'member-company',
            //     component: lazyLoading('Pages/Member/Org'),
            // },
            {
                name:"member-blacklist",
                alias:"黑名单管理",
                index:'4-3',
                funcId:'R040200',
                path:"",
                children:[
                    {
                        name:"member-blacklist-personal",
                        alias:"个人客户",
                        funcId:'R040300',
                        index:'4-3-1',
                        path:'member-blacklist-personal',
                        component: lazyLoading('Pages/Member/BlackListPersonal'),
                    },
                ]
            },
        ]
    },
    {
        icon:"pie-graph",
        name:"数据统计",
        funcId:'R020000',
        redirect: '/stat-contract',
        index:'2',
        children:[
            {
                name:"stat-contract",
                alias:"借款合同",
                index:'2-1',
                funcId:'R020100',
                path:'stat-contract',
                component: lazyLoading('Pages/Stat/Contract'),
            },
            {
                name:"stat-outcome",
                alias:"还款计划",
                funcId:'R020200',
                index:'2-2',
                path:'stat-outcome',
                component: lazyLoading('Pages/Stat/Outcome'),
            },
            {
                name:"stat-income",
                alias:"回款计划",
                funcId:'R020300',
                index:'2-3',
                path:'stat-income',
                component: lazyLoading('Pages/Stat/Income'),
            },
            {
                name:"授信查询",
                alias:"授信查询",
                funcId:'R020400',
                index:'2-4',
                path:'stat-credit',
                component: lazyLoading('Pages/Stat/Credit'),
            },
            {
                name:"stat-info",
                alias:"客户信息",
                funcId:'R020500',
                index:'2-5',
                path:'stat-info',
                component: lazyLoading('Pages/Stat/Info'),
            },
            {
                name:"stat-invest",
                alias:"投资记录",
                funcId:'R020600',
                index:'2-6',
                path:'stat-invest',
                component: lazyLoading('Pages/Stat/Invest'),
            },
            {
                name:"stat-operate",
                alias:"运营数据",
                funcId:'R020700',
                index:'2-7',
                path:'stat-operate',
                component: lazyLoading('Pages/Stat/Operate'),
            },
            {
                name:"stat-feeFlow",
                alias:"手续费",
                funcId:'R020800',
                index:'2-8',
                path:'stat-feeFlow',
                component: lazyLoading('Pages/Stat/feeFlow'),
            },
        ]
    },

    {
        icon:"ios-people",
        name:"业务管理",
        redirect: '/business-product',
        funcId:'R060000',
        index:'6',
        children:[
            {
                name:"business-product",
                alias:"借款产品",
                index:'6-1',
                funcId:'R060100',
                path:'business-product',
                component: lazyLoading('Pages/Business/Product'),
            },
            {
                name:"business-personal-credit",
                alias:"个人授信",
                index:'6-2',
                funcId:'R060200',
                path:'business-personal-credit',
                component: lazyLoading('Pages/Business/PersonalCredit'),
            },
            {
                name:"business-loan-grant",
                alias:"签约放款",
                index:'6-3',
                funcId:'R060300',
                path:'business-loan-grant',
                component: lazyLoading('Pages/Business/Grant'),
            },
            {
                name:"business-loan-verify",
                alias:"业务确认",
                index:'6-4',
                funcId:'R060400',
                path:'business-loan-verify',
                component: lazyLoading('Pages/Business/Verify'),
            },
            {
                name:"business-loan-verify",
                alias:"合同交接",
                index:'6-5',
                funcId:'R060500',
                path:'business-loan-verify',
                component: lazyLoading('Pages/Business/Verify'),
            },
        ]
    },
    {
        icon:"ios-people",
        name:"营销管理",
        redirect: '/market-info',
        funcId:'R050000',
        index:'5',
        children:[
            {
                name:"market-info",
                alias:"客户查询",
                index:'5-1',
                funcId:'R050100',
                path:'market-info',
                component: lazyLoading('Pages/Market/Info'),
            },
            {
                name:"market-trade",
                alias:"交易记录查询",
                funcId:'R050200',
                index:'5-2',
                path:'market-trade',
                component: lazyLoading('Pages/Market/Trade'),
            },
            {
                name:"market-invest",
                alias:"投资查询",
                funcId:'R050300',
                index:'5-3',
                path:'market-invest',
                component: lazyLoading('Pages/Market/Invest'),
            },
            {
                name:"market-contract",
                alias:"借款查询",
                funcId:'R050400',
                index:'5-4',
                path:'market-contract',
                component: lazyLoading('Pages/Market/Contract'),
            },
            {
                name:"market-outcome",
                alias:"还款查询",
                funcId:'R050500',
                index:'5-5',
                path:'market-outcome',
                component: lazyLoading('Pages/Market/Outcome'),
            },
            {
                name:"market-income",
                alias:"回款查询",
                funcId:'R050600',
                index:'5-6',
                path:'market-income',
                component: lazyLoading('Pages/Market/Income'),
            },
            {
                name:"market-credit",
                alias:"授信查询",
                funcId:'R050700',
                index:'5-7',
                path:'market-credit',
                component: lazyLoading('Pages/Market/Credit'),
            },
            {
                name:"market-balance",
                alias:"余额查询",
                funcId:'R050800',
                index:'5-8',
                path:'market-balance',
                component: lazyLoading('Pages/Market/Balance'),
            },
            {
                name:"market-record",
                alias:"对账单",
                funcId:'R050900',
                index:'5-9',
                path:'market-record',
                component: lazyLoading('Pages/Market/Account'),
            },
        ]
    },

    {
        name:"特殊业务",
        redirect: '/special-guarantee-change',
        funcId:'R070000',
        index:'7',
        children:[
            {
                name:"special-guarantee-change",
                alias:"担保变更",
                index:'7-1',
                funcId:'R070100',
                path:'special-guarantee-change',
                component: lazyLoading('Pages/Special/Guarantee'),
            },
            // {
            //     name:"special-five-grades",
            //     alias:"五级分类变更",
            //     index:'7-2',
            //     funcId:'R070200',
            //     path:'special-five-grades',
            //     component: lazyLoading('Pages/Special/Grades'),
            // },
            // {
            //     name:"special-bad-debts",
            //     alias:"呆坏账核销",
            //     index:'7-3',
            //     funcId:'R070200',
            //     path:'special-bad-debts',
            //     component: lazyLoading('Pages/Special/Debts'),
            // },

            {
                name:"special-user-info",
                alias:"客户信息变更",
                index:'7-5',
                funcId:'R070500',
                path:'special-user-info',
                component: lazyLoading('Pages/Special/Info'),
            },
            {
                name:"special-credit-modify",
                alias:"授信变更",
                index:'7-6',
                funcId:'R070600',
                path:'special-credit-modify',
                component: lazyLoading('Pages/Special/Credit'),
            },
            {
                name:"special-customer-transfer",
                alias:"客户移交",
                index:'7-7',
                funcId:'R070700',
                path:'special-customer-transfer',
                component: lazyLoading('Pages/Special/Customer'),
            },

            // {
            //     name:"business-loan-grant",
            //     alias:"签约放款",
            //     index:'6-3',
            //     funcId:'R060300',
            //     path:'business-loan-grant',
            //     component: lazyLoading('Pages/Business/Grant'),
            // },
            // {
            //     name:"business-loan-verify",
            //     alias:"业务确认",
            //     index:'6-4',
            //     funcId:'R060400',
            //     path:'business-loan-verify',
            //     component: lazyLoading('Pages/Business/Verify'),
            // },
        ]
    },
    {
        icon:"ios-cart",
        name:"用户系统",
        funcId:'R030000',
        index:'3',
        redirect: '/user-manage',
        // role:0,
        children:[
            {
                name:"user-info",
                alias:"用户管理",
                index:'3-1',
                funcId:'R030100',
                path:'user-manage',
                component: lazyLoading('Pages/User/Manage'),
            },
            {
                name:"user-org",
                alias:"机构管理",
                index:'3-2',
                funcId:'R030200',
                path:'user-org',
                component: lazyLoading('Pages/User/Org'),
            },
            {
                name:"user-role",
                alias:"权限管理",
                index:'3-3',
                funcId:'R030300',
                path:'user-role',
                component: lazyLoading('Pages/User/Role'),
            },
            {
                name:"user-station",
                alias:"岗位管理",
                index:'3-4',
                funcId:'R030400',
                path:'user-station',
                component: lazyLoading('Pages/User/Station'),
            },
            {
                name:"user-dict",
                alias:"字典管理",
                index:'3-5',
                funcId:'R030500',
                path:'user-dict',
                component: lazyLoading('Pages/User/Dict'),
            },
        ]
    },
]

let arr = [
    {
        path: '',
        redirect: '/index-dashboad'
    }
]

list.forEach((ele,index)=>{
    if(!!ele.children){
        let navs = ele.children
        navs.forEach((v)=>{
            if(!!v.children){
                Array.prototype.push.apply(arr,v.children);
            }else{
                arr.push(v)
            }
        })

    }else {
        arr.push(ele)
    }

})




const routes = [
    {
        path: '',
        component: Layout,
        beforeEnter:requireAuth,
        children: arr
    },
    {
        path: '/login',
        name:'login',
        component: lazyLoading('Com/Login')
    },
    {
        path: '/print',
        name:'print',
        component: lazyLoading('Pages/Print/Index')
    },
    {
        path: '/print-account',
        name:'print-account',
        component: lazyLoading('Pages/Print/Account')
    },
    {
        path: '/print-contract',
        name:'print-contract',
        component: lazyLoading('Pages/Print/Contract')
    },
    // {
    //     path: '/logout',
    //     name:'logout',
    //     beforeEnter (to, from, next) {
    //         auth.logout()
    //         next('/login')
    //     }
    // },
    { path: '*', component: lazyLoading('Com/Login') }
];




//定义路由
var router = new VueRouter({
    mode: 'hash',
    routes // （缩写）相当于 routes: routes
})


export default router