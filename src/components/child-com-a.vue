<template>
	<div class="standalone-block">
		<span>这里是子组件A</span>
		<button @click="emitCurrentComFn">触发当前组件中的持续监听事件</button>
		<button @click="emitParentPageFn">触发父组件中的持续监听事件</button>
		<button @click="emitBrotherFn">触发兄弟组件B中的持续监听事件</button>
	</div>
</template>

<script>
import { useStore } from 'vuex'
import eventbus from '/src/utils/eventbus.js'

export default {
	name: 'child-com-a',

	setup() {
		const store = useStore()

		eventbus.on('listenerInChildA', data => {
			store.commit('addLog', `子组件A的持续监听器被${data.trigger}触发了`)
		})

		eventbus.once('listenerInChildA_once', data => {
			store.commit('addLog', `子组件A的一次性监听器被${data.trigger}触发了`)
		})

		const handers = {
			emitCurrentComFn() {
				eventbus.emit('listenerInChildA', { trigger: '他自己' })
			},
			emitParentPageFn() {
				eventbus.emit('listenerInParent', { trigger: '子组件A' })
			},
			emitBrotherFn() {
				eventbus.emit('listenerInChildB', { trigger: '子组件A' })
			},
		}

		return {
			...handers,
		}
	},
}
</script>
