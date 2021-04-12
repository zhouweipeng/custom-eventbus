/**
 * @date 2021-04-12
 * @author zhouweipeng
 */

// 缓存所有事件
const eventCache = new Map()

/**
 * 绑定监听事件
 * @param {String} eventName
 * @param {Function} callback
 * @param {Object?} options
 */
function on(eventName, callback, options) {
  const isHas = eventCache.has(eventName)
  const newEvent = { callback, options }
  if (isHas) eventCache.get(eventName).push(newEvent)
  else eventCache.set(eventName, [newEvent])
}

/**
 * 解除绑定监听事件
 * @param {String?} eventName
 * @param {Function?} callback
 */
function off(eventName, callback = null) {
  if (!eventName) return eventCache.clear()
  if (!callback) return eventCache.delete(eventName)
  const eventList = eventCache.get(eventName)
  const tryFindIndex = eventList.findIndex(item => item.callback === callback)
  if (~tryFindIndex) eventList.splice(tryFindIndex, 1)
}

/**
 * 触发绑定的监听事件
 * @param {String} eventName
 * @param {Any?} params
 */
function emit(eventName, params) {
  const eventList = eventCache.get(eventName)
  if (!eventList) return
  eventList.forEach(({ callback, options }) => {
    callback(params)
    if (options?.isOnce) off(eventName, callback)
  })
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
