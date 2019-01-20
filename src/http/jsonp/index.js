/**
 * 封装jsonp 解决跨域请求问题
 * @author Abner
 * @time 2019.01.08
 */

import orgJsonp from 'jsonp'
import { joinParam } from '../../common/js/utils'

/**
 * JSONP 跨域请求函数
 * @param url {String} 请求路径
 * @param data {Object} 路径后面带的 query 参数
 * @param callBackName {String} orgJsonp callBack function name
 * @returns {Promise} Promise
 */
export default function Index (url, data, callBackName) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + joinParam(data)

  return new Promise((resolve, reject) => {
    orgJsonp(url, callBackName, (err, data) => {
      if (!err) {
        resolve(data) // 请求成功，就会返回请求的数据，并抛出一个成功的Promise标识
      } else {
        reject(err)
      }
    })
  })
}
