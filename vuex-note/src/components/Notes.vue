<template>
	<div class="ui container notes">
		<h4 class="ui horizontal divider header">
			<i class="icon paw"></i>
			Local Notes (by use Vue + Vuex + Loki.js from ninghao.net) 
		</h4>
		<a class="ui right floated basic violet button"
			@click="createNote">
			添加笔记
		</a>
		<div class="ui divided items">
			<note 
				v-for="entity in entities"
				v-bind:noteData="entity"
				v-bind:key="entity.$loki">	
				<!-- 向Note组件动态传递Prop -->
			</note>
			<span class="ui small disabled header"
				v-if="!entities.length">
				还没有笔记，请按下“添加笔记”按钮。
			</span>
		</div>
	</div>
</template>

<script>
	import Note from './Note'
	import { mapGetters, mapActions } from 'vuex'

	export default {
		created () {
			this.initial()		// from actions.js
		},
		methods: {
			// initial: function () {
			// 	return this.$store.actions.initial		
			// },
			...mapActions([
				'initial',
				'createNote'
			])
		},
		computed: {
			// entities: function () {
			// 	return this.$store.getters.entities
			// }
			...mapGetters([
				'entities'
			])
		},
		components: {
			Note
		}
	}
</script>

<style>
	
</style>