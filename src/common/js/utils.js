/**
 * 函数工具库
 * @author Abner
 * @time 2019.01.08
 */

/**
 * DOM 操作
 * 返回一个元素的左边，上边和宽高
 * @param {DOM} el dom对象
 * @returns {{top: number, left: number, width: number, height: number}}
 */
export function getRect (el) {
  if (el instanceof window.SVGElement) {
    let rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}

/**
 * DOM 为摸个元素添加样式
 * @param {DOM} el dom对象
 * @param {String} className
 */
export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }

  let classNameList = el.className.split(' ')
  classNameList.push(className)
  el.className = classNameList.join(' ')
}

/**
* DOM 判断一个元素是否有某个样式的名称
* @param {DOM} el dom对象
* @param className {String} class name
* @return {Boolean}
 */
export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')

  return reg.test(el.className)
}

/**
 * DOM 获取属性的值
 * @param {DOM} el dom对象
 * @param {String} name 需要获取属性的名字
 * @param {*} val 可选，存在是表示设置属性的值
 * @returns {string}
 */
export function getData (el, name, val) {
  const prefix = 'data-'
  let prop = prefix + name
  if (val) {
    el.setAttribute(prop, val)
  } else {
    return el.getAttribute(prop)
  }
}

/**
 * 拼接URL的参数
 * @param {Object} data 被拼接的对象
 * @returns {string}
 */
export function joinParam (data) {
  let url = ''
  for (let k in data) {
    let value = data[k] === undefined ? '' : data[k]
    url += '&' + k + '=' + encodeURIComponent(value)
  }

  return url ? url.substring(1) : ''
}
