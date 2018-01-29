// 创建的数据库对象 可在Console控制台输出
const db = new loki('notes', {
	autoload: true,							// 自动载入
	autoloadCallback: databaseInitialize,		// 自动载入的回调
	autosave: true,							// 自动保存
	autosaveInterval: 3000			// 自动保存间隔
})

function databaseInitialize() {
	const notes = db.getCollection('notes')
	if (notes === null) {
		db.addCollection('notes')
	}
}

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

// Console
// 
// db 											=>	Loki {filename: "notes", collections: Array(1), databaseVersion: 1.5, engineVersion: 1.5, autosave: true, …}
// 得到notes集合
// const notesCollection = db.getCollection('notes')
// 查看notes集合
// notesCollection.find()		=>	[]
// 增
// notesCollection.insert({body: 'hello'})
// 查
// notesCollection.find()		=>	0:{body: "hello", meta: {…}, $loki: 1}
// 根据条件查询
// const note = notesCollection.findOne({'$loki': 1})
// 改
// note.body = 'haha'
// 更新修改的内容
// notesCollection.update(note)
// note 										=>	0:{body: "haha", meta: {…}, $loki: 1}
// 删
// notesCollection.remove(note)
// notesCollection.findOne({'$loke': 1})	=> null


