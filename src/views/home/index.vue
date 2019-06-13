<template>
  <div class="page">
    <!--只放置需要滚动的内容-->
    <scroll
      ref="scrollWrap"
      :data="homeData"
      :pullDownRefresh="true"
      :pullUpLoad="true"
      class="home-scroll-warp"
      @pullingDown="pullingDownGetNewData"
      @pullingUp="pullingUpGetMore"
    >
      <!--幻灯片-->
      <div class="slider-wrap">
        <slider v-if="sliderData.length > 0">
          <div v-for="(item, index) in sliderData" :key="index">
            <a :href="item.linkUrl">
              <img height="200px" :src="item.picUrl">
            </a>
          </div>
        </slider>
      </div>

      <!--内容列表-->
      <div
        class="main-content"
        v-for="item in homeData"
        :key="item.id"
      >{{ item.text }}</div>
    </scroll>

    <!--Loading-->
    <loading :isShowLoading="homeData.length===0 || sliderData.length===0"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/components/scroll'
import Slider from '@/components/slider/index'
import Loading from '@/components/loading'
import { getSliderData, getHomeListData } from '@/api/home'
const DEFAULT_PAGE = 0
const DEFAULT_SIZE = 5

export default {
  name: 'home',
  components: {
    Scroll,
    Loading,
    Slider
  },
  data () {
    return {
      homeData: [], // 页面数据
      sliderData: [], // 幻灯片数据
      isShowLoading: true, // Loading
      hasMore: true, // 分页数据是否还有更多
      page: DEFAULT_PAGE, // 当前展示第几页的数据
      size: DEFAULT_SIZE // 每页展示多少条数据
    }
  },
  created () {
    getSliderData().then(res => {
      if (res.code === 0) {
        // 大公司的成功状态码一般用 0 表示
        this.sliderData = res.data.slider
      }
    })
  },
  activated () {
    this.isShowLoading = true
    this._getHomeListData()
  },
  methods: {
    pullingDownGetNewData () {
      // 下拉刷新回调
      this._getHomeListData()
    },
    pullingUpGetMore () {
      // 上拉加载回调
      if (!this.hasMore) {
        this.$refs.scrollWrap.forceUpdate(false)
        this.hasMore = false
        return
      }

      this.page++
      getHomeListData(this.page, this.size, 1000).then((res) => {
        if (res.isEmpty) {
          // 没有更多数据了，把scroll组件强制更新一遍
          this.$refs.scrollWrap.forceUpdate(false)
          this.hasMore = false
          return
        }
        this.homeData = this.homeData.concat(res.data)
      }, () => {
        // 异常回退
        this.page--
      })
    },
    _getHomeListData () {
      this.page = DEFAULT_PAGE
      this.size = DEFAULT_SIZE
      this.hasMore = true
      getHomeListData(this.page, this.size, 100).then((res) => {
        if (res.isEmpty) {
          this.hasMore = false
        }
        this.homeData = res.data
        this.isShowLoading = false
      })
    }
  }
}
</script>

<style scoped rel="stylesheet/stylus" lang="stylus">
  .page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .home-scroll-warp {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .slider-wrap {
      height: 200px;
      width: 100%;
      overflow: hidden;
    }
  }
  .main-content {
    height: 100px;
    margin-top: 10px;
    background-color: #58a;
    text-align: center;
    line-height: 100px;
    &:first-child {
      margin-top: 0;
    }
  }
</style>
