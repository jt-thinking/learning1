/* globals localStorage */
import  cache from  './cache'


export default {
    login (user) {
        cache.set('loginStatus', true, {exp : 10000});
        cache.set('token', user.token, {exp : 10000});
        cache.set('userId', user.id, {exp : 10000});
        // Vue.http.headers.common['authorization'] = localStorage.getItem('token');
        // cb = arguments[arguments.length - 1]
        // if (localStorage.token) {
        //     if (cb) cb(true)
        //     this.onChange(true)
        //     return
        // }
        // pretendRequest(email, pass, (res) => {
        //     if (res.authenticated) {
        //         localStorage.token = res.token
        //         if (cb) cb(true)
        //         this.onChange(true)
        //     } else {
        //         if (cb) cb(false)
        //         this.onChange(false)
        //     }
        // })
    },
    setRoles(roles){
        cache.set('roles', roles, {exp : 10000});
    },
    getRoles(){
        let roles =  cache.get('roles')
        return roles
    },
    checkRole(funcId){
        let roles = cache.get('roles')
        let ele   = roles.find((v)=>{
            return v.funcId == funcId
        })
        if(!!ele){
            return true
        }else{
            return false
        }
    },
    // checkCom(superId,funcId){
    //     let roles      = cache.get('roles')
    //     let superEle   = roles.find((v)=>{
    //         return v.funcId == superId
    //     })
    //     let ele = superEle.children.find((v)=>{
    //         return v.funcId == funcId
    //     })
    //     if(!!ele && ele.deleteFlag == 1){
    //         return true
    //     }else{
    //         return false
    //     }
    // },
    setUser(user){
        localStorage.user = user? JSON.stringify(user): null
    },
    getUserId(){
        let userId =  cache.get('userId')
        return userId
    },
    getUser(){
        let user = localStorage.user ? JSON.parse(localStorage.user) : ""
        return user
    },
    getToken () {
        let token =  cache.get('token')
        return token
    },
    touchToken(){
        cache.touch('token', 10000);
        cache.touch('loginStatus', 10000);
        cache.touch('roles', 10000);
        cache.touch('userId', 10000);
    },
    logout (cb) {
        cache.delete('loginStatus')
        cache.delete('token')
        if (cb) cb()
        this.onChange(false)
    },

    loggedIn () {
        let loginStatus = cache.get('loginStatus')
        return !!loginStatus
    },

    onChange () {}
}

// function pretendRequest (email, pass, cb) {
//     setTimeout(() => {
//         if (email === 'joe@example.com' && pass === 'password1') {
//             cb({
//                 authenticated: true,
//                 token: Math.random().toString(36).substring(7)
//             })
//         } else {
//             cb({ authenticated: false })
//         }
//     }, 0)
// }