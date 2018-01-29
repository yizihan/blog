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