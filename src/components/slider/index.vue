<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dots-item"
        v-for="(item, index) in dotsNumber"
        :class="{active: currentPageIndex === index}"
        :key="index"
      >
      </span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { addClass } from '../../common/js/utils'
import BScroll from 'better-scroll'

export default {
  name: 'mySlider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    },
    autoPlay: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dotsNumber: [],
      currentPageIndex: 0 // 获取当前的页数
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }

      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  activated () {
    if (this.autoPlay) {
      this._play()
    }
  },
  deactivated () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    _setSliderWidth (resize) {
      let width = 0
      this.children = this.$refs.sliderGroup.children
      let clientWidth = this.$refs.slider.clientWidth

      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(this.children[i], 'slider-item')

        child.style.width = clientWidth + 'px'
        width += clientWidth
      }

      if (this.loop && !resize) {
        width += 2 * clientWidth
      }

      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots () {
      this.dotsNumber = new Array(this.children.length)
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        bounce: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })

      // 监听butter-scroll的事件，获取当前的页数
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        // console.log('this.slider.getCurrentPage().pageX = ' + this.slider.getCurrentPage().pageX)

        if (this.autoPlay) {
          this._play()
        }
      })

      this.slider.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    _play () {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slider
    position: relative
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        a
          display: block
          width: 100%
        img
          display: block
          width: 100%
    .dots
      position: absolute
      bottom: 10%
      width: 100%
      text-align: center
      line-height: 9px
      z-index: 9
      .dots-item
        vertical-align: middle
        display: inline-block
        margin-right: 7px
        width: 8px
        height: 8px
        border-radius: 50%
        background-color: rgba(0, 0, 0, 0.6)
        &.active
          width: 12px
          border-radius: 5px
          background-color: #fff
</style>
