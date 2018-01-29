# Local Notes (by use Vue + Loki.js from ninghao.net) 

```
npm install --save-dev browser-sync
npm start	
// => browser-sync start --server --no-notify --files='index.html, *.css, *js'
```
## LokiJS
轻量级的面向文档的数据库，由JavaScript实现。

```
const db = new loki('notes', {
    autoloadCallback: databaseInitialize
    ...
})
// 初始化
function databaseInitialize() {
	const notes = db.getCollection('notes')
	if (notes === null) {
		db.addCollection('notes')
	}
}
// 定义获取数据方法
function loadCollection(collection) {
	return new Promise(resolve => {
		db.loadDatabase({}, () => {
			// 数据集合表 
			const _collection = db.getCollection(collection) || db.addCollection(collection)
			// 将_collection返回给外部
			resolve(_collection)
		})
	})
}
```

### 数据的初始化及数据流的传递
```
// Notes Component
data () {
	return {
		entities: []
	}
},
// 实例被创建之后执行的代码
created () {
	loadCollection('notes')				    	// loadCollection方法获取 notes 数据表内容，得到Promise格式
		.then(collection => {				// collection => db.getCollection('notes')
			const _entities = collection.chain()
				.find()				// 找到所有数据
				.simplesort('$loki', 'isdesc')	// 按照$loki排序
				.data()				// 找到data
			this.entities = _entities     		// 从数据库读取到的数据
		})
},
<note 
	v-for="entity in entities"          	// 遍历渲染得到的数据
	v-bind:entityObjectNote="entity"	// 向Note Component传递数据entity
	v-bind:key="entity.$loki"           	// 设置Note Component key
    v-on:destroyParent="destroyMethod"> 	// 设置自定义事件，由子组件Note $emit.destroy触发
</note>


// Note Component
props: ['entityObjectNote'],		     	// 从Notes中传过来的数据
data () {
	return {
		entity: this.entityObjectNote,  // 初始化data
		open: false
	}
},
<editor
	v-bind:entityObjectEditor="entity"   	// 向Editor Component传递数据
	v-on:updateParent="save"             	// 监听updateParent事件
	v-if="open"
></editor>

// Editor Component
props: ['entityObjectEditor'],         		// 从Note传过来的数据
data () {
	return {
		entity: this.entityObjectEditor
	}
},
<textarea 
	rows="5" 
	placeholder="..."
	v-model="entity.body"                	// 创建双向数据绑定，显示从父组件传递过来的值，并根据输入更新entity.body的值 
	@input="updateChild"
></textarea>
```

### 添加笔记
```
<a class="ui right floated basic violet button"
	@click="createNote">
	添加笔记
</a>
```
```
createNote () {
	loadCollection('notes')
		.then((collection) => {             
			const entity = collection.insert({  // 向数据库插入笔记
				body: ''                    // 初始值为空，等用户在textarea中输入
			})
			db.saveDatabase()		    // 保存修改后的数据库
			this.entities.unshift(entity)       // 向data中的entities添加数据
		})
}
```

### 编写笔记
```
// Editor
<textarea 
	rows="5" 
	placeholder="..."
	v-model="entity.body"
	@input="updateChild"                    // input输入事件触发updateChild
></textarea>
updateChild () {
	this.$emit('updateParent')              // 触发当前Editor组件绑定的updateParent事件
}

// Note
<editor
	v-bind:entity-object="entity"
	v-on:updateParent="updateEntity"        // 在Editor组件监听updateParent事件
	v-if="open"
></editor>
updateEntity () {
	loadCollection('notes')
		.then(collection => {
			collection.update(this.entity)  // 向数据库更新用户的输入
			db.saveDatabase()
		})
},

```

### 删除笔记
```
// Note
<i class="right floated trash outline icon"
	v-if="open"
	@click="destroyChild"
></i>
destroyChild () {
	this.$emit('destroyParent', this.entity.$loki)  // 触发当前Note组件上绑定的destroyParent事件
}

// Notes
<note 
	v-on:destroyParent="destroyMethod"
></note>
destroyMethod (id) {
	// 先在本地将要删除的数据过滤掉
	const _entities = this.entities.filter(entity => {
		return entity.$loki !== id
	})
	this.entities = _entities
	// 再从数据库中把当前选中的值删除
	loadCollection('notes')
		.then(collection => {
			collection.remove({"$loki": id})
			db.saveDatabase()
		})
}
```
