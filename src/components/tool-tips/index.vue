<template>
  <transition name="drop">
    <div v-show="isShowToolTips" class="tool-tips">
      <p class="tool-tips-text">提示文字</p>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      isShowToolTips: false
    }
  },
  methods: {
    show (time = 2000) {
      this.isShowToolTips = true
      setTimeout(() => {
        this.isShowToolTips = false
      }, time)
    }
  }
}
</script>

<style scoped>
  .tool-tips {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .tool-tips-text {
    position: fixed;
    top: 15%;
    left: 0;
    right: 0;
    width: 200px;
    margin: 0 auto;
    padding: 20px 0;
    border-radius: 6px;
    text-align: center;
    font-size: 18px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);

  }
  .drop-enter-active {
    transition: all 0.3s;
  }
  .drop-enter-active .tool-tips-text {
    animation: drop-down 0.25s;
  }
  .drop-leave-active {
    animation: drop-up 0.2s;
  }
  @keyframes drop-down {
    0% {
      opacity: 0;
      top: 0;
    }
    100% {
      opacity: 1;
      top: 15%;
    }
  }
  @keyframes drop-up {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>
