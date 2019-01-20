<template>
  <div v-show="isShowLoading" class="loading">
    <div class="loading-content">
      <div class="img-wrap">
        <img src="./loading.gif">
      </div>
      <p class="loading-text">正在加载...</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    isShowLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 998;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    user-select: none;
  }
  .loading-content {
    position: fixed;
    top: 30%;
    left: 0;
    right: 0;
    width: 70px;
    height: 70px;
    margin: 0 auto;
    background-color: rgba(0, 0, 0, 0.6);
    text-align: center;
    border-radius: 8px;
  }
  .img-wrap {
    margin-top: 18px;
  }
  .img-wrap img {
    width: 20px;
  }
  .loading-text {
    font-size: 12px;
    line-height: 1.5;
    color: #fff;
    font-weight: 500;
  }
</style>
