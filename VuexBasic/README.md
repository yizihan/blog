
## Browsersync 运行项目
```
browser-sync start --server --files "*.html, *.js"
```

Vuex是Vue的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证以一种可预测的方式发生变化。

![此处输入图片的描述][1]

```
Vue Components ==Dispatch==> Actions ==Commit==> Mutations ==Mutate==> State ==Render==> Vue Components
// Dispatch：派发给Actions
// Commit：提交给Mutations
// Mutate：改变数据
// Render：用新数据渲染模板
```

## Vuex-State
### 驱动应用程序的数据源
```
state: {
	count: [1, 2, 3]
},
```
### 在Vue组件中获得Vuex-State
Vuex的状态存储是响应式的，从store.state中读取状态的方法i**计算属性**中返回这个状态。
```
computed: {
    count () {
        return store.state.count
    }
}
```
在根实例中注册store选项，该sotre实例会注入到根组件下的所有子组件中，在子组件中能通过 `this.$store` 访问到。

---

## Vuex-Getter
State的派生状态（可以认为是store的计算属性），当依赖的state发生了改变时，会被重新计算。
Getter会暴露为`store.getters`对象
```
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
```

---

## Vuex-Mutation
更改State唯一的方法就是提交Mutation。
每个Mutation都有一个字符串的**事件类型（type）**和一个**回调函数（handler）**。

```
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
```
触发一个类型为`increment`的Mutation，调用它的回调函数。
```
store.commit('increment')
```

### Mutation必须是同步函数
### 在组件中中提交Mutation
mapMutatioins辅助函数将数组中的methods映射为 `store.commit`调用。
```
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
```
---

## Vuex-Action
- Action提交的是Mutation，而不是直接改变State
- Action可以包含任意异步操作

Action函数接受一个与store实例具有相同方法和属性的context对象，因此可以调用`context.commit`提交一个Mutation，或者通过`context.state`获取State、通过`context.getters`获取Getters。

### 分发Action
Action通过`store.dispatch`方法触发
```
mutations: {
  increment (state, payload) {
    state.count = state.count + payload
  }
},
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}

// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})
```

### 组合Action
store.dispatch可以处理被触发的Action的回调函数的Promise，并且store.dispatch仍旧返回Promise
```
store.dispatch('actionA').then(() => {
  // ...
})

actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
        commit('someOtherMutation')
    })
}
```


  [1]: https://vuex.vuejs.org/zh-cn/images/vuex.png