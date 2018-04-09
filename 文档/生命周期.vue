<template>
  <div class='div1'>
  </div>
</template>
<script>
export default {
  data () {
    return {
      a: 'Vue.js'
    }
  },
  methods: {
  },
  beforeCreate: function () {
    console.log('创建前')
    console.log('a:' + this.a)
    console.log('el:' + this.$el)
    console.log('store:' + this.$store.state.dictionaries)
  },
  created: function () {
    console.log('创建后')
    console.log('a:' + this.a)
    console.log('el:' + this.$el)

  },
  beforeMount: function () {
    console.log('mounted前')
    console.log('a:' + this.a)
    console.log('el:' + this.$el)

  },
  mounted: function () {
    console.log('mounted后')
    console.log('a:' + this.a)
    console.log('el:' + this.$el)

  },
  beforeUpdate: function () {
    console.log('Update前')
    console.log('a:' + this.a)
    console.log('el:' + this.$el)

  },
  updated: function () {
    console.log('Update后')
    console.log('a:' + this.a)
    console.log('el:' + this.$el)

  },
  beforeDestroy: function () {
    console.log('销毁前')
    console.log('a:' + this.a)
    console.log('el:' + this.$el)

  },
  destroyed: function () {
    console.log('销毁后')
    console.log('a:' + this.a)
    console.log('el:' + this.$el)

  }
}
</script>

<style type="text/css">

</style>
