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