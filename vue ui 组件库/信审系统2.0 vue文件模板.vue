<template>
  <div>
    <!-- 表单区 -->

    <!-- 表格区 -->
  </div>
</template>
<script>
export default {
  components: {
    // 'user-info': UserInfo,
    // 'credit-info':CreditInfo

  },
  data () {
    return {
      // 外部组件区
      message: undefined,
      NotificationType: undefined

      // tab区

      // 表单区

      // 表格区

      // 分页区
    }
  },
  created: function () {

  },
  mounted: function () {

  },
  computed: {
  },
  methods: {

    // 外部组件区

    // 通知组件
    Notification () {
      const h = this.$createElement;

      this.$notify({
        title: '',
        message: h('i', { style: 'color: teal' }, this.message),
        type:this.NotificationType 
        //  success/warning/info/error
      });
    },

    /*this.$http.get(url, { params }).then(res => {
      if (res.body.code == "200") {

      }

    })*/

    // 表单区

    // 表格区

    // 分页区
      
  }
}
</script>
<style lang="scss" scoped>
 @import './';
</style>
<style scoped>

</style>
@media screen and (max-width: 1500px) {

}