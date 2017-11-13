/**
 * Created by lifetea on 2017/4/18.
 * email: 494886251@qq.com
 * github: https://github.com/lifetea
 */
let md5 = require('./md5')

//md5加密
let md5Encrypt = function (val) {
    return md5(val).toUpperCase()
}



let reqData = {
    mobiel:null,
    name:'lifetea',
    certNo:'',
    status:0
}

// console.log(reqData)

let dataClear = function (obj) {
    for (var a in obj){
        if(obj[a] === null || obj[a] === '' || obj[a] === undefined )
            delete obj[""+a]
    }
}

// dataClear(reqData)
//
// console.log(reqData)


let dataReset = function (obj) {
    for (var a in obj){
        obj[a] = null
    }
}


let getFile = function (response,fileName) {
    var headers             = response.headers;
    var blob                = new Blob([response.data],{type:headers['content-type']});
    var link                = document.createElement('a');
    link.href               = window.URL.createObjectURL(blob);
    link.download           = fileName+'.xls';
    link.click();
}


let isEmpty = function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}



let arrayGroupBy = function (list) {
    let arr = []
    for (var i = 0; i < list.length; i++) {
        let description = list[i].description;
        let res = arr.find((v)=>{
            return v.description == description
        })
        if (!res) {
            let a = []
            a.push(list[i])
            arr.push({
                description:description,
                children:a
            })
        }else{
            res.children.push(list[i])
        }
    }

    return arr
}

// let arrayList = [{"id":14,"organId":"000","roleName":"总经理","description":"总经理室","enableFlag":1,"deleteFlag":0},{"id":18,"organId":"000","roleName":"副总经理","description":"总经理室","enableFlag":1,"deleteFlag":0},{"id":20,"organId":"000","roleName":"行政岗","description":"综合支持","enableFlag":1,"deleteFlag":0},{"id":22,"organId":"000","roleName":"人事专员","description":"人力资源","enableFlag":1,"deleteFlag":0},{"id":26,"organId":"000","roleName":"工程师","description":"商业技术","enableFlag":1,"deleteFlag":0}]
// let sortRes = arrayGroupBy(arrayList)
// console.log(sortRes)

export default {
    dataClear:dataClear,
    dataReset:dataReset,
    getFile:getFile,
    isEmpty:isEmpty,
    arrayGroupBy:arrayGroupBy,
    md5Encrypt:md5Encrypt
}