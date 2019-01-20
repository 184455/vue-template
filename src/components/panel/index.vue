<template>
  <ul class="panel">
    <li
      v-for="(item, index) in panelData"
      :key="index"
      class="panel-item"
      @click="selectedItem(item, index)"
    >
      <p class="text">{{ item.showText }}</p>
      <div class="img-icon">
        <img src="./select@3x.png" />
      </div>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'panel',
  props: {
    panelData: {
      type: Array,
      default () {
        return [
          {
            showText: 112
          },
          {
            showText: 113
          }
        ]
      }
    }
  },
  methods: {
    selectedItem (item, index) {
      console.log(index)
      console.log(item)
      this.$emit('panelDataChange')
    }
  }
}
</script>

<style scoped lang="stylus">
  .panel {
    position: relative;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    background-color: #fff;
    .panel-item {
      display: flex;
      align-items: center;
      margin-left: 15px;
      padding: 15px 15px 15px 0;
      border-bottom: 1px solid #eee;
      .text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .img-icon {
        img {
          height: 14px;
          width: 14px;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
</style>
