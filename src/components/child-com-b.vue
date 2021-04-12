<template>
	<div class="standalone-block">
		<span>这里是子组件B</span>
		<button @click="emitCurrentComFn">触发当前组件中的持续监听事件</button>
		<button @click="emitParentPageFn">触发父组件中的持续监听事件</button>
		<button @click="emitBrotherFn">触发兄弟组件A中的持续监听事件</button>
	</div>
</template>

<script>
import { useStore } from 'vuex'
import eventbus from '/src/utils/eventbus.js'

export default {
	name: 'child-com-b',

	setup() {
		const store = useStore()

		eventbus.on('listenerInChildB', data => {
			store.commit('addLog', `子组件B的持续监听器被${data.trigger}触发了`)
		})

		eventbus.once('listenerInChildB_once', data => {
			store.commit('addLog', `子组件B的一次性监听器被${data.trigger}触发了`)
		})

		const handers = {
			emitCurrentComFn() {
				eventbus.emit('listenerInChildB', { trigger: '他自己' })
			},
			emitParentPageFn() {
				eventbus.emit('listenerInParent', { trigger: '子组件B' })
			},
			emitBrotherFn() {
				eventbus.emit('listenerInChildA', { trigger: '子组件B' })
			},
		}

		return {
			...handers,
		}
	},
}
</script>
