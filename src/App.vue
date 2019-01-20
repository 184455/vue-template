<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'app',
  data () {
    return {
      transitionName: ''
    }
  },
  watch: {
    $route (to, from) {
      // 这里对应着路由定义里面的值
      if (to.meta.index !== undefined && from.meta.index !== undefined) {
        if (to.meta.index > from.meta.index) {
          this.transitionName = 'slide-left'
        } else if (to.meta.index < from.meta.index) {
          this.transitionName = 'slide-right'
        } else {
          this.transitionName = ''
        }
      }
    }
  }
}
</script>

<style lang="stylus"></style>
