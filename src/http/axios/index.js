/**
 * Axios 封装
 */

import axios from 'axios'
import AxiosDefaultConfig from './axios-config'

// 1、创建一个 axios 的实例
let instance = axios.create(AxiosDefaultConfig)

// 2.1、添加发送请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 2.2、添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // 这里只返回服务器响应的数据
  return response.data
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 3、封装请求的函数，返回 Promise

/**
 * Get 请求
 * @param {String} url 请求地址
 * @param {Object} params 跟在地址后面的 query 请求参数
 * @returns {AxiosPromise<any>} 返回 Promise 对象
 */
export function getSomething (url, params) {
  const config = {
    // 'Authorization': 'Bearer 9c1cf830-7026-4e37-9736-92e33da3a588',
    params: params
  }
  return instance.get(url, config)
}

/**
 * Post 请求
 * @param {String} url 请求地址
 * @param {Object} data 请求体带的参数
 * @returns {AxiosPromise<any>} 返回 Promise 对象
 */
export function postSomething (url, data) {
  const config = {
    data: data
  }
  return instance.post(url, config)
}

/**
 * Delete 请求
 * @param {String} url 请求地址
 * @param {Object} params 跟在地址后面的 query 请求参数
 * @returns {AxiosPromise<any>} 返回 Promise 对象
 */
export function deleteSomething (url, params) {
  const config = {
    params: params
  }
  return instance.delete(url, config)
}

/**
 * Put 请求
 * @param {String} url 请求地址
 * @param {Object} data 请求体带的参数
 * @returns {AxiosPromise<any>} 返回 Promise 对象
 */
export function putSomething (url, data) {
  const config = {
    data: data
  }
  return instance.put(url, config)
}
