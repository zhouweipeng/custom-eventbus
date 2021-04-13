# custom-eventbus

## 更新日志

> **2021-04-13**

> 新增：on、once、off可传入字符串数组，同时监听多个事件

## 说明

> 如果访问速度较慢可用[gitee地址](https://gitee.com/zwpjy/custom-eventbus)

> 因为vue3移除了`$on`、`$off`和`$once`这几个全局api，所以尝试手动实现一下

> 全部代码加上注释和换行总共不到70行，还算是比较简单的

> 包含的功能基本和原先一致：

1. `on(eventName, callback)`: 绑定监听事件，参数1是监听的事件名，参数2是回调函数
2. `once(eventName, callback)`: 设置一次性监听事件，调用过一次之后会自动解绑，参数同上
3. `off(eventName?, callback?)`: 解绑监听事件，同时传事件名和函数就只解除这个函数，只传事件名就解除该事件名下的所有回调函数，什么都不传则解除所有事件监听器
4. `emit(eventName, params?)`: 触发监听事件，参数2为传递给监听器的参数

## 示例预览
[![crpJr6.png](https://z3.ax1x.com/2021/04/12/crpJr6.png)](https://imgtu.com/i/crpJr6)

## 用法

```js
// 导入eventbus
import eventbus from './utils/eventbus.js'
import { onBeforeUnmount } from 'vue'

export default {
  setup() {
    // setup函数的执行时机相当于beforeCreate和created之间，可以在这里设置监听函数
    eventbus.on('acceptDataFromSomewhere', data => {
	    console.log('acceptDataFromSomewhere被触发')
	    console.log('接收到的参数 ===>', data)
    })

    eventbus.once('onceListenerFn', data => {
	    console.log('onceListenerFn被触发')
	    console.log('接收到的参数 ===>', data)
    })

    // 在页面销毁前记得解除事件的监听，防止内存泄漏，这里我直接移除了所有监听器
    onBeforeUnmount(eventbus.off)

    return {}
  }
}
```

> 在页面中的任意位置可触发事件，包括本页面、子组件、父组件、兄弟组件等其他一些远房亲戚关系= =

```html
  <button @click="emitListener">点击触发事件</button>
```

```js
  setup() {
    function emitListener() {
      eventbus.emit('acceptDataFromSomewhere', {
        msg: 'hahaha'
      })
    }

    return { emitListener }
  }
```

> 大概就这些了吧，之后如果其他插件里有什么好玩的新功能我会尝试复原一下。

> 有bug欢迎提交issue。觉得海星的话希望可以给个海星⭐
