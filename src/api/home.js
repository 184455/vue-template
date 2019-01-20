/**
 * 首页模块接口
 */

import { getSomething } from '../http/axios'

/**
 * 获取首页换灯片数据
 * @returns {AxiosPromise<any>}
 */
export function getSliderData () {
  return getSomething('/api/get-home-slider')
}

export function getHomeListData (page, size, interval = 100) {
  const originData = [
    {
      id: '008',
      text: 'Star 星星评分组件',
      jumpUrl: ''
    },
    {
      id: '007',
      text: 'Spinner 另一种Loading',
      jumpUrl: ''
    },
    {
      id: '006',
      text: 'Panel 面板',
      jumpUrl: ''
    },
    {
      id: '005',
      text: 'Scroll 组件',
      jumpUrl: ''
    },
    {
      id: '004',
      text: 'Confirm 框',
      jumpUrl: ''
    },
    {
      id: '003',
      text: 'TopTip 组件',
      jumpUrl: ''
    },
    {
      id: '002',
      text: 'Loading 组件',
      jumpUrl: ''
    },
    {
      id: '001',
      text: '幻灯片组件',
      jumpUrl: ''
    }
  ]
  let res = []

  // 1、计算总共能分多少页
  let totalPage = Math.ceil(originData.length / size)

  // 2、计算数据的起始位置，页码从 0 开始
  let getDataIndex = page * size

  // 3、如果有足够多数据则获取
  if (page <= totalPage) {
    res = originData.slice(getDataIndex, getDataIndex + size)
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: res,
        isEmpty: page >= totalPage,
        total: originData.length,
        currentPage: page,
        size: size
      })
    }, interval)
  })
}
