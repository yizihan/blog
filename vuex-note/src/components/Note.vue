<template>
	<div class="item" >
		<div class="meta">
			{{ updated(noteData) }}
		</div>
		<div class="content">
			<div class="header" @click="open = !open">
				<!-- 当读取的数据为空时，使用默认数据 -->
				{{ header(noteData) || '新建笔记' }}
			</div>
			<div class="extra" >
				<editor v-bind:editorData="noteData" v-if="open">
				</editor>
				{{ words(noteData) }}字
				<i class="right floated trash outline icon"
					@click="destroyNote(noteData)" v-if="open">
				</i>
			</div>
		</div>
	</div>
</template>

<script>
	import Editor from "./Editor"
	import { mapGetters, mapActions } from 'vuex'

	export default {
		props: ['noteData'],
		data () {
			return {
				open: false
			}
		},
		computed: {
			...mapGetters([
				'updated',
				'words',
				'header'
			])
		},
		methods: {
			...mapActions(['destroyNote'])
		},
		components: {
			Editor
		}
	}
</script>

<style>
	
</style>