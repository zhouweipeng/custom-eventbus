<template>
	<div class="main-wrapper">
		<div class="standalone-block parent-block">
			<span>这里是父组件的内容</span>
			<button @click="emitCurrentPageFn(false)">触发当前页面中的持续监听事件</button>
			<button @click="emitChildAFn(false)">触发子组件A中的持续监听事件</button>
			<button @click="emitChildBFn(false)">触发子组件B中的持续监听事件</button>
			<!-- 一次性监听器 -->
			<span class="tip">一次性监听器触发过之后会自动移除</span>
			<button @click="emitCurrentPageFn(true)">触发当前页面中的一次性监听事件</button>
			<button @click="emitChildAFn(true)">触发子组件A中的一次性监听事件</button>
			<button @click="emitChildBFn(true)">触发子组件B中的一次性监听事件</button>
			<child-com-a />
			<child-com-b />
			<button @click="unBindAllEvent">解绑所有事件</button>
			<button @click="emitMultiEvent(false)">触发同时绑定的multiEvent</button>
			<button @click="emitMultiEvent(true)">触发同时绑定的multiEvent_once</button>
		</div>
		<!-- 输出日志 -->
		<div class="logs-wrapper">
			<div v-for="item in logs" :key="item.date" class="log-item">
				<span>{{ new Date(item.date).toLocaleString() }}</span>
				<span>{{ item.msg }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import childComA from './components/child-com-a.vue'
import childComB from './components/child-com-b.vue'
import { onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import eventbus from './utils/eventbus.js'

export default {
	components: {
		childComA,
		childComB,
	},

	setup() {
		const store = useStore()
		const logs = store.state.logs

		// 可以传一个字符串，也可以传字符串数组同时表示监听多个事件
		eventbus.on(['listenerInParent', 'multiEvent'], data => {
			store.commit('addLog', `父组件的持续监听器被${data.trigger}触发了`)
		})

		eventbus.once(['listenerInParent_once', 'multiEvent_once'], data => {
			store.commit('addLog', `父组件的一次性监听器被${data.trigger}触发了`)
		})

		// 在页面销毁前记得解除事件的监听，防止内存泄漏，这里我直接移除了所有监听器
		onBeforeUnmount(eventbus.off)

		const handers = {
			emitCurrentPageFn(isOnce) {
				eventbus.emit(`listenerInParent${isOnce ? '_once' : ''}`, { trigger: '他自己' })
			},
			emitChildAFn(isOnce) {
				eventbus.emit(`listenerInChildA${isOnce ? '_once' : ''}`, { trigger: '父组件' })
			},
			emitChildBFn(isOnce) {
				eventbus.emit(`listenerInChildB${isOnce ? '_once' : ''}`, { trigger: '父组件' })
			},
			unBindAllEvent() {
				eventbus.off()
			},
			emitMultiEvent(isOnce) {
				eventbus.emit(`multiEvent${isOnce ? '_once' : ''}`, { trigger: 'multiEvent' })
			},
		}

		return {
			logs,
			...handers,
		}
	},
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 20px;
	font-size: 14px;
}

.standalone-block {
	max-width: 500px;
	border-radius: 5px;
	background-color: #fff;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	padding: 20px;
	margin: 20px auto 0;
}

.standalone-block span:first-child {
	font-weight: bold;
	color: #409eff;
}

.standalone-block.parent-block {
	margin: 0;
}

button {
	display: block;
	margin: 20px auto 0;
	padding: 5px 10px;
}

.tip {
	display: block;
	margin-top: 20px;
	color: #e6a23c;
}

.main-wrapper {
	display: flex;
	justify-content: center;
	align-items: flex-start;
}

.logs-wrapper {
	border-radius: 5px;
	background-color: #fff;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	width: 300px;
	min-height: 50px;
	margin-left: 20px;
	overflow: hidden;
}

.logs-wrapper:empty {
	position: relative;
}

.logs-wrapper:empty::before {
	content: '暂无日志';
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: #999;
}

.log-item {
	margin: 20px;
}

.log-item + .log-item {
	border-top: 1px solid #eee;
	padding-top: 20px;
}

.log-item span {
	display: block;
	text-align: left;
}

.log-item span:first-child {
	color: #999;
	margin-bottom: 5px;
}
</style>
