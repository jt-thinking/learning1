/**
 * Created by lifetea on 2017/3/15.
 * email: 494886251@qq.com
 * github: https://github.com/lifetea
 */

let list = [
    {
        label: '总部营业部',
        options: [{
            name: '江涛',
            no:'9101',
            value:'9101',
            initial:'JT',
            phone:'18857631006'
        }, {
            name: '蒋高登',
            value:'9018',
            no:'9018',
            initial:'JGD',
            phone:'18857631007'
        }]
    },
    {
        label: '新河营业部',
        options: [{
            value: 'Shanghai',
            name: '罗新亮',
            no:'9032',
            initial:'LXL',
            phone:'18857631008'
        }, {
            value: 'Beijing',
            name: '赵本全',
            no:'9057',
            initial:'ZBQ',
            phone:'18857631009'
        }]
    },
    {
        label: '泽国营业部',
        options: [
            {
                value: 'Chengdu',
                name: '梁峰',
                no:'9005',
                initial:'LF',
                phone:'18857631001'
            },
            {
                value: 'Shenzhen',
                name: '林敬皓',
                no:'9083',
                initial:'LJH',
                phone:'18857631002'
            },
            {
                value: 'Guangzhou',
                name: '叶谨肇',
                no:'9145',
                initial:'LJZ',
                phone:'18857631003'
            }
        ]
    },
    {
        label: '大溪营业部',
        options: [
            {
                value: 'Chengdu',
                name: '毛仙华',
                no:'9081',
                initial:'MXH',
                phone:'13557631003'
            }, {
                value: 'Shenzhen',
                name: '陈宣邑',
                no:'9067',
                initial:'CYY',
                phone:'13557631004'
            }, {
                value: 'Guangzhou',
                name: '谢晨晨',
                no:'9079',
                initial:'XCC',
                phone:'13557631033'
            }, {
                value: 'Dalian',
                name: '郑佳妮',
                no:'9093',
                initial:'ZJN',
                phone:'13557631203'
            },
            {
                value: 'Dalian',
                name: '孔笑笑',
                no:'9138',
                initial:'KXX',
                phone:'13543361003'
            },
            {
                value: 'Dalian',
                name: '王石',
                no:'9159',
                initial:'WS',
                phone:'13557361003'
            }
        ]
    }
];

let queryByName = '罗'

var findByName = function (val,query) {
    let array = Array.from(val)
    let newArray = []
    array.forEach(item =>{
        var t = item.options.filter(op=>{
            // console.log('op:'+op.name)
            return op.name.indexOf(query)>-1
        })
        if(t.length>0)
            newArray.push({
                label:item.label,
                options:t
            })
    });
    return newArray
}

// 根据名字查询测试
//
//
// let resByName = findByName(list,queryByName)
//
// console.log('filter by name:',resByName)
//
// console.log(list)

let queryByNo = '90'

var findByNo = function (val,query) {
    let array = Array.from(val)
    let newArray = []
    array.forEach(item =>{
        var t = item.options.filter(op=>{
            // console.log('op:'+op.name)
            return op.no.indexOf(query)>-1
        })
        if(t.length>0)
            newArray.push({
                label:item.label,
                options:t
            })
    });
    return newArray
}



let resByNo = findByNo(list,queryByNo)

// console.log('filter by no:',resByNo)

// console.log(list)

var findByPhone = function (val,query) {
    let array = Array.from(val)
    let newArray = []
    array.forEach(item =>{
        var t = item.options.filter(op=>{
            // console.log('op:'+op.name)
            return op.phone.indexOf(query)>-1
        })
        if(t.length>0)
            newArray.push({
                label:item.label,
                options:t
            })
    });
    return newArray
}
let queryByMobile = '18857'

let resByMobile = findByPhone(list,queryByMobile)

// console.log(resByMobile)

let queryByInitial = 'W'

var findByInitial = function (val,query) {
    let array       = Array.from(val)
    let newArray    = []
    array.forEach(item =>{
        var t = item.options.filter(op=>{
            // console.log('op:'+op.name)
            return op.initial.indexOf(query)>-1
        })
        if(t.length>0)
            newArray.push({
                label:item.label,
                options:t
            })
    });
    return newArray
}


let resByInitial = findByInitial(list,queryByInitial)




var findByVal = function (val,query) {
    let array       = Array.from(val)
    let res         = null
    array.forEach(item =>{
        item.options.forEach(op=>{
            if(op.value == query){
                res = op
                return res
            }
        })
    });
    return res
}


let resByVal = findByVal(list,"9101")

// console.log(resByVal)

// console.log('filter by initial:',resByInitial)

// console.log('---')


export default {
    'list':[],
    'findByName':findByName,
    'findByNo':findByNo,
    'findByInitial':findByInitial,
    'findByPhone':findByPhone,
    'findByVal':findByVal
}