// 引入mapGetters
const mapGetters = Vuex.mapGetters
const mapActions = Vuex.mapActions

const store = new Vuex.Store({
	// 驱动应用程序的数据源
	state: {
		count: [1, 2, 3]
	},
	// Mutation 是更改state的唯一方法
	// Mutation 必须同步执行
	mutations: {
		add (state, payload) {
			state.count.push(payload)
		},
		remove (state) {
			state.count.pop()
		},
		// 从后台获取数据，更改数据源
		setCount (state, payload) {
			state.count = payload
		}
	},
	// Getter 得到state派生的一些状态，可供其他组件使用
	getters: {
		sum (state) {
			return state.count.reduce((a, b) => a + b, 0)
		},
		total (state) {
			return state.count.length
		},
		average (state, getters) {
			return +(getters.sum / getters.total).toFixed(1)
		}
	},
	// Action 提交的是Mutation，而不是直接变更状态
	// Action 可以包含任意异步操作 
	// Action 通过store.dispatch方法触发
	actions: {
		// context 与store实例具有相同方法和属性的对象
		getCount(context) {
			// console.log(context)
			return axios.get('http://localhost:8899/api/count')
									.then((response) => {
										// console.log(response.data)
										// 执行一次setCount commit，将请求回来的数据设置为当前数据
									 	context.commit('setCount', response.data.count)
									})
		},
		// 通过axios将number的值放入到后端的count数组中
		// 然后再放入到本地的count数组中，保持数据同步
		// addCount ({commit}, payload) {
		// {commit} => ES6参数解构 == 相当于context.commit
		addCount (context, payload) {
			return axios.post('http://localhost:8899/api/count', { number: payload })
									.then((response) => {
										context.commit('add', payload)
									})
		},
		removeCount ({commit}) {
			return axios.delete('http://localhost:8899/api/count')
									.then((response) => {
										commit('remove')
									})
		}
	}
})

const AddButton = {
	template: `
		<button class="ui button" @click="add">Add</button>
	`,
	methods: {
		...mapActions(['addCount']),
		add () {
			// 生成随机数 1~10
			// old
			// this.$store.commit('add', Math.floor(Math.random() * (10 - 1) + 1))
			this.addCount(Math.floor(Math.random() * (10 - 1) + 1))
		}
	}
}

const RemoveButton = {
	template: `
		<button class="ui button" @click="remove">Remove</button>
	`,
	methods: {
		...mapActions(['removeCount']),
		remove () {
			// this.$store.commit('remove')
			this.removeCount()
		}
	}
}

const Counter = {
	template: `
		<div>
			<add-button></add-button>
			<remove-button></remove-button>
			<div class="ui red circular label">
				{{ countAverage }}
			</div>
		</div>
	`,
	computed: {
		// average () {
		// 	// ES6 Array.reduce 累加
		// 	// return this.$store.state.count.reduce((a, b) => a + b, 0)
			
		// 	// return this.$store.getters.sum
		// 	return this.$store.getters.average
		// 	// 碌梅脫脙getters露脭脧贸
		// },
		// sum () {
		// 	return this.$store.getters.sum
		// },
		// total () {
		// 	return this.$store.getters.total
		// }
		
		// ES6 扩展运算符 Array
		// ...mapGetters(['sum', 'total', 'average'])
		
		// ES6 扩展运算符 Object 可重命名
		...mapGetters({
			countSum: 'sum',
			countAverage: 'average',
			countTotal: 'total'
		})
	},
	methods: {
		// 将Action中的方法拿过来
		...mapActions([
			'getCount'		
		])
	},
	// 组件挂载之后触发
	mounted () {
		// this.$store.dispatch('getCount')
		this.getCount()
	},
	components: {
		AddButton,
		RemoveButton
	}
}

const app = new Vue({
	el: '#app',
	template: `
		<div class="app">
			<counter></counter>
		</div>
	`,
	components: {
		Counter
	},
	store,				// import Vuex instance
})



