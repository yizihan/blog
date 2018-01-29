const Editor = {
	template: `
		<div class="ui form">
			<div class="field">
		<textarea 
			rows="5" 
			placeholder="..."
			v-model="entity.body"
			@input="updateChild"
		></textarea>
			</div>
		</div>
	`,
	props: ['entityObjectEditor'],
	data () {
		return {
			entity: this.entityObjectEditor
		}
	},
	methods: {
		updateChild () {
			// 向父级传递
			this.$emit('updateParent')
		}
	}
}

const Note = {
	template: `
		<div class="item" >
			<div class="meta">
				{{ updated }}
			</div>
			<div class="content">
				<div class="header" @click="open = !open">
					<!-- 当读取的数据为空时，使用默认数据 -->
					{{ header || '新建笔记' }}
				</div>
				<div class="extra">
					<editor
						v-bind:entityObjectEditor="entity"
						v-on:updateParent="save"
						v-if="open"
					></editor>
					{{ words }}字
					<i class="right floated trash outline icon"
						v-if="open"
						@click="destroyChild"
					></i>
				</div>
			</div>
		</div>
	`,
	props: [
		'entityObjectNote'		// 从父组件中传过来的数据
	],
	data () {
		return {
			entity: this.entityObjectNote,
			open: false
		}
	},
	computed: {
		header () {
			return _.truncate(this.entity.body, {length: 30})
		},
		updated () {
			// use moment.js
			// this.entity.meta.updated 数据库自动记录的更新时间
			return moment(this.entity.meta.updated).fromNow()
		},
		words () {
			return this.entity.body.trim().length
		}
	},
	methods: {
		save () {
			loadCollection('notes')
				.then(collection => {
					collection.update(this.entity)
					db.saveDatabase()
				})
		},
		destroyChild () {
			this.$emit('destroyParent', this.entity.$loki)
		}
	},
	components: {
		'editor': Editor
	}
}

const Notes = {
	data () {
		return {
			entities: []
		}
	},
	template: `
		<div class="ui container notes">
			<h4 class="ui horizontal divider header">
				<i class="icon paw"></i>
				Local Notes (by use Vue + Loki.js from ninghao.net) 
			</h4>
			<a class="ui right floated basic violet button"
				@click="create">
				添加笔记
			</a>
			<div class="ui divided items">
				<!-- v-bind:entityObject="entity" 动态Prop，将entity数据传递给子组件 -->
				<note 
					v-for="entity in entities"
					v-bind:entityObjectNote="entity"	
					v-bind:key="entity.$loki"
					v-on:destroyParent="destroyMethod"
				></note>
				<span class="ui small disabled header"
					v-if="!this.entities.length">
					还没有笔记，请按下“添加笔记”按钮。
				</span>
			</div>
		</div>
	`	,
	// 实例被创建之后执行的代码
	created () {
		loadCollection('notes')				// loadCollection方法获取 notes 数据表内容，得到Promise格式
			.then(collection => {				// collection => db.getCollection('notes')
				const _entities = collection.chain()
					.find()									// 找到所有数据
					.simplesort('$loki', 'isdesc')	// 按照$loki排序
					.data()									// 找到data
				this.entities = _entities
			})
	},
	methods: {
		create () {
			loadCollection('notes')
				.then((collection) => {
					// 向数据库插入笔记
					const entity = collection.insert({
						body: ''
					})
					// 保存修改后的数据库
					db.saveDatabase()		
					// 向data中的entities添加数据
					this.entities.unshift(entity)
				})
		},
		destroyMethod (id) {
			// 先在本地将要删除的数据过滤掉
			const _entities = this.entities.filter(entity => {
				return entity.$loki !== id
			})
			this.entities = _entities

			loadCollection('notes')
				.then(collection => {
					collection.remove({"$loki": id})
					db.saveDatabase()
				})
		}
	},
	components: {
		"note": Note
	}
}

const app = new Vue({
	el: '#app',
	template:`
			<notes></notes>
	`,
	components: {
		'notes': Notes
	}
})