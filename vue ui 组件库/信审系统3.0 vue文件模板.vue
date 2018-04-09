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
      funcId: ''
    }
  },
  created: function () {
    if (!this.$Auth.checkRole(this.funcId)) {
      this.$router.push('/error')
    }
  },
  mounted: function () {

  },
  computed: {
  },
  methods: {
    /*this.$http.get(url, { params }).then(res => {
      if (res.body.code === 200) {

      }
    })*/

  }
}
</script>
<style lang='scss' scoped>

</style>
