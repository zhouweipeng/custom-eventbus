/**
 * @date 2021-04-12
 * @author zhouweipeng
 * 
 * @update 2021-04-13
 * @explain 新增on、once、off可传入字符串数组，同时监听多个事件
 */

// 缓存所有事件
const eventCache = new Map()

/**
 * 绑定监听事件
 * @param {String | Array<string>} eventName
 * @param {Function} callback
 * @param {Object?} options
 */
function on(eventName, callback, options) {
  const eventNames = [].concat(eventName)
  for (const name of eventNames) {
    const isHas = eventCache.has(name)
    const newEvent = { callback, options }
    if (isHas) eventCache.get(name).push(newEvent)
    else eventCache.set(name, [newEvent])
  }
}

/**
 * 解除绑定监听事件
 * @param {String? | Array<string>?} eventName
 * @param {Function?} callback
 */
function off(eventName, callback = null) {
  if (!eventName?.length) return eventCache.clear()
  const eventNames = [].concat(eventName)
  if (!callback) return eventNames.forEach(name => eventCache.delete(name))
  for (const name of eventNames) {
    const eventList = eventCache.get(name)
    const tryFindIndex = eventList.findIndex(item => item.callback === callback)
    if (~tryFindIndex) eventList.splice(tryFindIndex, 1)
  }
}

/**
 * 触发绑定的监听事件
 * @param {String} eventName
 * @param {Any?} params
 */
function emit(eventName, params) {
  const eventList = eventCache.get(eventName)
  if (!eventList) return
  for (const { callback, options } of eventList) {
    callback(params)
    if (options?.isOnce) off(eventName, callback)
  }
}

/**
 * 绑定单次的监听事件
 * @param {String} eventName
 * @param {Function} callback
 */
function once(eventName, callback) {
  on(eventName, callback, {
    isOnce: true
  })
}

export default {
  on,
  off,
  emit,
  once,
}
