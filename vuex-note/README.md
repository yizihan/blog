
# Vue+Vuex Note

---

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


## Vuex-State
```
// 定义通用state
export default {
  entities: []
}

```

## Vuex-Getters
```
import moment from 'moment'
import _ from 'lodash'
moment.locale('zh-CN')

// state的派生
export const entities = state => {
	return state.entities			// 读取state.js中的entities
}

// 以下箭头函数的解释说明
// export const updated = function (state) {
// 	return function (noteData) {							// 返回的是一个函数，所以需要调用updated()
// 		return moment(noteData.meta.updated).fromNow()
// 	}
// }

// 笔记更新时间
export const updated = state => noteData => {
	return moment(noteData.meta.updated).fromNow()
}
// 笔记数字量
export const words = state => noteData => {
	return noteData.body.length
}
// 笔记标题
export const header = state => noteData => {
	return _.truncate(noteData.body, { length: 30 })
}
```

## Vuex-Mutation
```
import { loadCollection, db } from '../database'

export default {
	// 从数据库初始化state.entities的值
	setInitialData (state) {
		loadCollection('notes')				// loadCollection方法获取 notes 数据表内容，得到Promise格式
			.then(collection => {				// collection => db.getCollection('notes')
				const _entities = collection.chain()
					.find()													// 找到所有数据
					.simplesort('$loki', 'isdesc')	// 按照$loki排序
					.data()													// 找到data
				state.entities = _entities				// 更改state.entities
			})
	},
	// 创建笔记
	createEntity (state) {
		loadCollection('notes')
			.then((collection) => {
				const entity = collection.insert({	// 向数据库插入笔记
					body: ''
				})
				db.saveDatabase()										// 保存修改后的数据库
				state.entities.unshift(entity)			// 向state.entities添加数据
			})
	},
	// 保存笔记
	updateEntity (state, entity) {
		loadCollection('notes')
			.then(collection => {
				collection.update(entity)
				db.saveDatabase()
			})
	},
	// 删除笔记
	destroyEntity (state, entity) {
		// 先在本地将要删除的数据过滤掉
		const _entities = state.entities.filter(_entity => {
			return _entity.$loki !== entity.$loki
		})
		state.entities = _entities

		loadCollection('notes')
			.then(collection => {
				collection.remove(entity)
				db.saveDatabase()
			})
	}
}
```

## Vuex-Actions
```
// Action函数接受具有store实例相同方法和属性的context对象
// context.commit => { commit}		// ES6解构

export const initial = ({ commit }) => {
	commit('setInitialData')				// 提交Mutation
}

export const createNote = ({ commit }) => {
	commit('createEntity')
}

export const updateNote = ({ commit }, entity) => {
	commit('updateEntity', entity)
}

export const destroyNote = ({ commit }, entity) => {
	commit('destroyEntity', entity)
}
```

## Vuex-index
```
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 输出所有state、getters、mutations、actions
export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions
})
```

## 引入Vuex
```
// main.js
import store from './store'
new Vue({
  store,        // 全局使用Vuex
})
```

## mapGetters、mapActions
```
computed: {
    // entities: function () {
    // 	return this.$store.getters.entities
    // }
    ...mapGetters([
        'entities'      // getters.js entities
    ])
},
methods: {
    // initial: function () {
    // 	return this.$store.actions.initial		
    // },
    ...mapActions([
    	'initial',      // actions.js initial()
    	'createNote'
    ])
},
```

## Notes.vue
```
<note 
	v-for="entity in entities"
	v-bind:noteData="entity"
	v-bind:key="entity.$loki">	
	<!-- 向Note组件动态传递Prop => noteData -->
</note>
```

## Note.vue
```
props: ['noteData'],    // 接收来自Notes的props
<editor 
    v-bind:editorData="noteData">
    <!-- 向Editor组件动态传递Prop => editorData -->
</editor>
```

## Editor.vue
```
props: ['editorData'],  // 接收来自Note的props
<textarea 
	rows="5" 
	placeholder="..."
	v-model="editorData.body"   // 双向数据绑定
	v-on:input="updateNote(editorData)">    // 修改数据时触发保存
</textarea>
```

与上一个vue-note实例相比，全局引入了Vuex，使得所有的组件都可以访问store中的内容，使得修改数据变得方便；不用再设置$emit去触发父级组件中的事件。
