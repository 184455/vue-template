<template>
  <div class="slider">
    <div class="slider-wrap"
         ref="sliderWrapper"
         @touchstart.stop="sliderStart"
         @touchmove.stop="sliderMove"
         @touchend.stop="sliderEnd"
         @transitoinend="transitionFinish"
         @webkitTransitionEnd="transitionFinish"
         @click.stop.prevent="sliderLinkTo"
    >
      <div class="slider-item">
        <a href="javascript:void(0)">
          <img :src="computedFirstBefore.img" alt="slider image" data-index="-1">
        </a>
      </div>
      <div class="slider-item" v-for="(item, index) in sliderData" :key="index">
        <a  href="javascript:void(0)">
          <img :src="item.img" alt="slider image" :data-index="index" :data-href="item.jumpUrl">
        </a>
      </div>
      <div class="slider-item">
        <a  href="javascript:void(0)">
          <img :src="computedLastAfter.img" alt="slider image" data-index="-2">
        </a>
      </div>
    </div>
    <div class="dots-wrap">
      <span v-for="(dots, dIndex) in sliderData"
            :key="dIndex"
            :class="{'dot-active' : currentShowIndex === dIndex}"
            class="dot-item"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sliderData: {
      type: [Array, Object],
      default: () => {
        return [
          {
            jumpUrl: 'https://www.baidu.com/',
            img: 'https://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/307277.jpg?max_age=2592000' // 最好使用 1080 * 432 尺寸的图片
          },
          {
            jumpUrl: '',
            img: 'https://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/309120.jpg?max_age=2592000'
          },
          {
            jumpUrl: '',
            img: 'https://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/307871.jpg?max_age=2592000'
          }
        ]
      }
    },
    threshold: {
      type: Number,
      default: 42
    },
    autoPlaying: {
      type: Boolean,
      default: true
    },
    sliderInterval: {
      type: Number,
      default: 4500
    },
    sliderTransitionTime: {
      type: Number,
      default: 450
    }
  },
  data () {
    return {
      currentShowIndex: 0, // 当前展示第几张幻灯片
      sliderTimer: '', // 保存自动播放时的定时器ID
      autoPlay: this.autoPlaying, // 控制在组件中是否自动播放
      autoPlayTemp: false, // 标记在自动播放情况下的幻灯片,被用户用手指拖动,强行停止过,判断此变量用于恢复autoPlay
      isTransitionFinished: true, // 判断幻灯片的过渡动画是否已完成
      isEndSlider: false, // 标识是否是最后一张幻灯片，方便转移到相应位置
      windowInnerWidth: window.innerWidth // 屏幕的宽度
    }
  },
  computed: {
    computedFirstBefore () {
      // 将最后一个元素拿到
      let sliderLength = this.sliderData.length
      return this.sliderData[sliderLength - 1]
    },
    computedLastAfter () {
      return this.sliderData[0]
    },
    sliderToLast () {
      let sliderLength = this.sliderData.length
      if (this.autoPlay) {
        return this.currentShowIndex === sliderLength
      } else {
        return (this.currentShowIndex === sliderLength) && (this.touch.deltaX < 0)
      }
    }
  },
  created () {
    // 这里创建一个全局变量保存用户滑动幻灯片的距离，这里创建的变量不会被监听，不是响应式的，实际上就是不需要此变量是响应
    this.touch = {}
    let vm = this

    // 监听程序是否进入后台运行，如果是，就清除定时器，否则，程序一直运行，体验很差
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') { // 隐藏 -> 显示
        if (vm.autoPlay) {
          vm._addNextSliderToProcess()
        }
      } else {
        clearInterval(vm.sliderTimer)
      }
    })
    document.addEventListener('webkitvisibilitychange', function () {
      if (document.visibilityState === 'visible') { // 隐藏 -> 显示
        if (vm.autoPlay) {
          vm._addNextSliderToProcess()
        }
      } else {
        clearInterval(vm.sliderTimer)
      }
    })
    window.addEventListener('resize', function () {
      if (vm.windowInnerWidth > (window.innerWidth + 20) || vm.windowInnerWidth < (window.innerWidth - 20)) {
        // 原来的宽度加上滚动条还是比现有屏幕宽度小，说明用户屏幕是真的变化了，不是由于出现滚动条引起的，就重新初始化幻灯片
        clearInterval(vm.sliderTimer)
        vm.windowInnerWidth = window.innerWidth
        vm._initSlider()
      }
    })
  },
  mounted () {
    // 初始化幻灯片，不能在created中初始化，此时还没有创建DOM
    let vm = this
    vm.$nextTick(() => {
      this._initSlider()
    })
  },
  methods: {
    sliderStart (ev) {
      // 记录开始时的信息
      let touchStart = ev.changedTouches[0]
      this.touch.startX = touchStart.pageX
      this.touch.startY = touchStart.pageY
      this.touch.originOffset = parseInt(this.$refs.sliderWrapper.style.left)
      this._setTransitionTime(0) // 用户用手指滑动时，不需要设置过渡时间
      clearInterval(this.sliderTimer)

      if (this.autoPlay) {
        // 用户手动滑动幻灯片，有关于定时自动播放的逻辑全部停止
        this.autoPlayTemp = true
        this.autoPlay = false
      }
    },
    sliderMove (ev) {
      // 当手指一移动时，幻灯片跟着手指移动，营造一种拖动的感觉
      let touchMove = ev.changedTouches[0]
      let deltaMove = touchMove.pageX - this.touch.startX
      let moveOffset = this.touch.originOffset + deltaMove
      this.$refs.sliderWrapper.style.left = `${moveOffset}px`
    },
    sliderEnd (ev) {
      let touchEnd = ev.changedTouches[0]
      let deltaX = touchEnd.pageX - this.touch.startX
      let jumpThreshold = this.windowInnerWidth * this.threshold / 100 /* 计算阈值范围，如果小于阈值，不自动跳转到下一张，如果超过，则自动滑到到下一张 */
      let clickIndex = parseInt(ev.target.dataset.index)
      this.touch.deltaX = deltaX // 用于在最后一张图判断用户的走向

      if (clickIndex === -1) {
        // 当用户快速滑动幻灯片时，到达前后的复制备份图，还没有触发transitionEnd 事件，就不会偷偷重置到第一张
        // 这个时候就会遇到这个BUG，这里只能强制回到某一张图片，这里按照设计，是没有动画的，但是出现了动画，一时还找不到原因
        this._setTransitionTime(0)
        this.$refs.sliderWrapper.style.left = `-${this.sliderData.length * this.windowInnerWidth}px`
        this.currentShowIndex = this.sliderData.length - 1
        this._recoveryAutoPlay()
        return
      }
      if (clickIndex === -2) {
        this._setTransitionTime(0)
        this.$refs.sliderWrapper.style.left = `-${this.windowInnerWidth}px`
        this.currentShowIndex = 0
        this._recoveryAutoPlay()
        return
      }

      this._setTransitionTime(this.sliderTransitionTime) // 恢复由于用户滑动时清除掉的过渡动画
      if (this.isTransitionFinished && (Math.abs(deltaX) > jumpThreshold)) {
        // 水平移动量大于阈值，满足自动滚动到上或下一张幻灯片的条件，并且动画已经结束
        if (deltaX > 0) {
          // 说明是需要滑动到上一张幻灯片
          this._preSlider(clickIndex)
        } else {
          // 说明是需要滑动到下一张幻灯片
          this._nextSlider(clickIndex)
        }
      } else {
        // 不满足自以上条件，把位移恢复到默认位置
        this.$refs.sliderWrapper.style.left = this.touch.originOffset + 'px'
        this._recoveryAutoPlay()
      }
    },
    transitionFinish () {
      if (this.isEndSlider) {
        this.isEndSlider = false
        this._setTransitionTime(0)
        if (this.currentShowIndex === 0) {
          this.$refs.sliderWrapper.style.left = `-${this.windowInnerWidth}px`
        } else {
          this.$refs.sliderWrapper.style.left = `-${this.sliderData.length * this.windowInnerWidth}px`
        }
      }
      this.isTransitionFinished = true
    },
    sliderLinkTo (ev) {
      let url = ev.target.dataset.href
      if (url.length > 0) {
        window.open(url)
      }
    },
    _initSlider () {
      let screenWidth = this.windowInnerWidth // 获取浏览器不包括滚动条的可视宽度
      let sliderWrapperWidth = (this.sliderData.length + 2) * screenWidth // 计算外部包裹容器的宽度，并加上克隆的两个幻灯片的宽度
      this.currentShowIndex = 0
      this.$refs.sliderWrapper.style.width = sliderWrapperWidth + 'px'
      this.$refs.sliderWrapper.style.left = `-${screenWidth}px`

      if (this.autoPlay) { // 自动播放
        this._addNextSliderToProcess()
      }
    },
    _preSlider (index) {
      // 上一张幻灯片
      this.isTransitionFinished = false
      this.currentShowIndex = index - 1
      if (this.currentShowIndex === -1) {
        this.currentShowIndex = this.sliderData.length - 1
        this.isEndSlider = true
      }
      let realSliderLeft = (index + 1) * this.windowInnerWidth - this.windowInnerWidth
      this.$refs.sliderWrapper.style.left = `-${realSliderLeft}px`

      this._recoveryAutoPlay()
    },
    _nextSlider (index) {
      // 下一张幻灯片
      this.isTransitionFinished = false
      let realSliderLeft = 0
      let vm = this

      // 防止第一张幻灯片加入执行队列时DOM还没有准备好，而引发的报错
      vm.$nextTick(() => {
        vm.currentShowIndex = index + 1
        if (vm.currentShowIndex === vm.sliderData.length) {
          vm.currentShowIndex = 0
          vm.isEndSlider = true
          vm.$refs.sliderWrapper.style.left = `-${(vm.sliderData.length + 1) * vm.windowInnerWidth}px`
        } else {
          realSliderLeft = (vm.currentShowIndex + 1) * vm.windowInnerWidth
          vm.$refs.sliderWrapper.style.left = `-${realSliderLeft}px`
        }

        if (vm.autoPlay) {
          vm._addNextSliderToProcess()
        }
        vm._recoveryAutoPlay()
      })
    },
    _setTransitionTime (time) {
      this.$refs.sliderWrapper.style['-webkit-transition'] = `all ${time}ms`
      this.$refs.sliderWrapper.style['transition'] = `all ${time}ms`
    },
    _addNextSliderToProcess () {
      let vm = this
      vm._setTransitionTime(vm.sliderTransitionTime)
      vm.sliderTimer = setTimeout(() => {
        vm._nextSlider(this.currentShowIndex)
      }, vm.sliderInterval)
    },
    _recoveryAutoPlay () {
      // 用于判断被用户停止的自动播放是否需要继续
      if (this.autoPlayTemp) {
        this.autoPlay = true
        this.autoPlayTemp = false
        this._addNextSliderToProcess()
      }
    }
  },
  deactivated () {
    clearInterval(this.sliderTimer)
  },
  beforeDestroy () {
    clearInterval(this.sliderTimer)
  }
}
</script>

<style scoped>
  .slider {
    position: relative;
    height: 150px;
    overflow: hidden;
  }
  .slider div, p, span, a, img {
    margin: 0;
    padding: 0;
  }
  .slider .slider-wrap {
    position: absolute;
    line-height: 1;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
  .slider .slider-item {
    display: inline-block;
    width: 100vw;
    margin: 0 -1px; /* 消除内联元素堆叠时左右各多出来的一个像素 */
    vertical-align: bottom;
  }
  .slider .slider-item a {
    display: inline-block;
    height: 150px;
  }
  .slider .slider-item a img {
    width: 100%;
    height: 100%;
    vertical-align: bottom;
  }
  .slider .dots-wrap {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    text-align: center;
  }
  .dots-wrap .dot-item {
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 5px;
    background-color: #777;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
  }
  .dots-wrap .dot-active {
    background-color: #fff;
  }
</style>
