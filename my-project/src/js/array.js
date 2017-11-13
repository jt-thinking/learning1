/**
 * Created by lifetea on 2017/7/20.
 * email: 494886251@qq.com
 * github: https://github.com/lifetea
 */
var list = [{"id":14,"organId":"000","roleName":"总经理","description":"总经理室","enableFlag":1,"deleteFlag":0},{"id":18,"organId":"000","roleName":"副总经理","description":"总经理室","enableFlag":1,"deleteFlag":0},{"id":20,"organId":"000","roleName":"行政岗","description":"综合支持","enableFlag":1,"deleteFlag":0},{"id":22,"organId":"000","roleName":"人事专员","description":"人力资源","enableFlag":1,"deleteFlag":0},{"id":26,"organId":"000","roleName":"工程师","description":"商业技术","enableFlag":1,"deleteFlag":0}]


var newArr = []
for (var i = 0; i < list.length; i++) {
    let description = list[i].description;
    // console.log(description)
    let res = newArr.find((v)=>{
        // console.log(description)
        return v.description == description
    })
    // console.log("res:",res)
    if (!res) {
        let a = []
        a.push(list[i])
        // console.log(list[i])
        newArr.push({
            description:description,
            children:a
        })
    }else{
        res.children.push(list[i])
    }
    // console.log(newArr)
    // groups[groupName].push(arr[i].color);
}


console.log(newArr)


