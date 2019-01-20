// vuex中，异步操作的部分和一些mutation提交函数封装
import * as types from './mutation.types'

export const setStateDataActions = ({ commit, state }, data) => {
  commit(types.SET_STATE_DATA, data)
}
