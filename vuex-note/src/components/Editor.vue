<template>
	<div class="ui form">
		<div class="field">
			<textarea 
				rows="5" 
				placeholder="..."
				v-model="editorData.body"
				v-on:input="updateNote(editorData)">
			</textarea>
		</div>
	</div>
</template>

<script>
	import { mapActions } from 'vuex'

	export default {
		props: ['editorData'],
		methods: {
			...mapActions(['updateNote'])
		}
	}
</script>

<style>
	
</style>