<template>
    <span>
        <span>
            <span>{{data.label}}</span>
        </span>
        <span style="float: right; margin-right: 20px">
            <el-button type="success" size="mini" @click.native.stop="doAdd">
            添加</el-button>
            <el-button type="info" size="mini">
                       <!--on-click={ () => this.remove(store, data) }-->
                删除</el-button>
        </span>
    </span>
</template>
<style>

</style>
<script>

    export default{
        props: {
            node:Object,
            data:Object,
            store:Object
        },
        data(){
            return{
                msg:'hello vue'
            }
        },
        created:function () {
//            console.log('node',this.node)
//            console.log("store",this.store)
//            console.log("data",this.data)
        },
        methods:{
          doAdd(){
//              this.append(this.store, this.data)
              this.store.append({ id: 10, label: 'testtest', children: [] });
//              window.s = this.store
//              console.log('node',this.node)
//              console.log("store",this.store)
//              console.log("data",this.data)
//              this.store.currentNode.insertChild({ id: 10, label: 'testtest', children: [] })
          }
        },
        components:{
        }
    }
</script>
