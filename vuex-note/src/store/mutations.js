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