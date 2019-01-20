// vuex的mutation，只有mutation才能能够修改store里面的数据

import * as types from './mutation.types'

const mutations = {
  [types.SET_STATE_DATA] (store, data) {
    store.queryCondition = data
  }
}

export default mutations
